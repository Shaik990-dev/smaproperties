import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function DELETE(req: NextRequest) {
  // 1. Verify the caller's ID token
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
  }

  const idToken = authHeader.slice(7);
  let callerId: string;
  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    callerId = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid auth token' }, { status: 401 });
  }

  // 2. Confirm the caller is an admin in RTD
  const callerSnap = await adminDb.ref(`users/${callerId}/isAdmin`).get();
  if (callerSnap.val() !== true) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3. Get the UID to delete from the request body
  const { uid } = await req.json() as { uid?: string };
  if (!uid) {
    return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
  }

  // 4. Prevent an admin from accidentally deleting themselves
  if (uid === callerId) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  // 5. Delete Firebase Auth account first, then RTD record
  try {
    await adminAuth.deleteUser(uid);
  } catch (err: unknown) {
    // If the Auth user doesn't exist, that's fine — still clean up RTD
    const code = (err as { code?: string }).code;
    if (code !== 'auth/user-not-found') {
      return NextResponse.json({ error: 'Failed to delete auth account' }, { status: 500 });
    }
  }

  await adminDb.ref(`users/${uid}`).remove();

  return NextResponse.json({ success: true });
}
