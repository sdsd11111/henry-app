import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trainerId = searchParams.get('trainer_id');

    let sql = 'SELECT * FROM clients';
    const params: any[] = [];
    if (trainerId) {
      sql += ' WHERE trainer_id = ?';
      params.push(trainerId);
    }

    const clients = await query(sql, params);
    return NextResponse.json({ success: true, clients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, client_type, name, username, password, trainer_id, time_slot, gender, goal } = body;

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    await query(
      `INSERT INTO clients (id, client_type, name, username, password_hash, trainer_id, time_slot, gender, goal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), username=VALUES(username), password_hash=COALESCE(VALUES(password_hash), password_hash), time_slot=VALUES(time_slot), gender=VALUES(gender), goal=VALUES(goal)`,
      [id, client_type, name, username || null, passwordHash, trainer_id || 'henry', time_slot || '', gender || '', goal || '']
    );

    return NextResponse.json({ success: true, message: 'Cliente guardado exitosamente' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
