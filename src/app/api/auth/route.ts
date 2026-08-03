import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, password } = body;

    if (action === 'login_coach') {
      const rows = (await query('SELECT * FROM coaches WHERE username = ?', [username])) as any[];
      if (rows.length === 0) {
        return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 401 });
      }

      const coach = rows[0];
      const match = await bcrypt.compare(password, coach.password_hash);
      if (!match) {
        return NextResponse.json({ success: false, message: 'Contraseña incorrecta' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: { id: coach.id, name: coach.name, username: coach.username, role: 'coach' }
      });
    }

    if (action === 'login_vip') {
      const rows = (await query('SELECT * FROM clients WHERE username = ? AND client_type = "vip"', [username])) as any[];
      if (rows.length === 0) {
        return NextResponse.json({ success: false, message: 'Cliente VIP no encontrado' }, { status: 401 });
      }

      const client = rows[0];
      const match = await bcrypt.compare(password, client.password_hash);
      if (!match) {
        return NextResponse.json({ success: false, message: 'Contraseña incorrecta' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: client.id,
          name: client.name,
          username: client.username,
          client_type: client.client_type,
          trainer_id: client.trainer_id,
          role: 'vip'
        }
      });
    }

    return NextResponse.json({ success: false, message: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
