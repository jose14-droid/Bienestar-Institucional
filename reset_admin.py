"""
Script para verificar o restablecer las credenciales del administrador
Ejecutar: python reset_admin.py
"""

import sys
import os

# Asegurar que el directorio actual esté en el path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Usar create_app para garantizar la misma configuración de base de datos
from app import create_app, db
from app.models import Usuario

app = create_app()

def reset_admin():
    with app.app_context():
        # Buscar el usuario admin
        admin = Usuario.query.filter_by(username='admin').first()
        
        if admin:
            print("=" * 50)
            print("USUARIO ADMIN ENCONTRADO")
            print("=" * 50)
            print(f"Username: {admin.username}")
            print(f"Email: {admin.email}")
            print(f"Nombre: {admin.nombre_completo}")
            print(f"Rol: {admin.rol}")
            print(f"Cédula: {admin.cedula}")
            print("=" * 50)
            print("\n¿Deseas restablecer la contraseña? (s/n): ", end="")
            respuesta = input().strip().lower()
            
            if respuesta == 's':
                nueva_password = input("Ingresa la nueva contraseña: ").strip()
                if nueva_password:
                    admin.set_password(nueva_password)
                    db.session.commit()
                    print(f"\n✓ Contraseña actualizada exitosamente!")
                    print(f"  Usuario: admin")
                    print(f"  Nueva contraseña: {nueva_password}")
                else:
                    print("\n✗ La contraseña no puede estar vacía")
            else:
                print("\n✓ Información del usuario admin:")
                print(f"  Usuario: admin")
                print(f"  Contraseña por defecto: admin123")
                print("\n  Si no puedes iniciar sesión, ejecuta este script")
                print("  nuevamente y elige 's' para restablecer la contraseña.")
        else:
            print("=" * 50)
            print("USUARIO ADMIN NO ENCONTRADO")
            print("=" * 50)
            print("Creando usuario admin...")
            
            admin = Usuario(
                cedula='1234567890',
                username='admin',
                email='admin@instituto.edu',
                nombre_completo='Administrador del Sistema',
                rol='admin',
                password_changed=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            
            print("✓ Usuario admin creado exitosamente!")
            print(f"  Usuario: admin")
            print(f"  Contraseña: admin123")
        
        print("\n" + "=" * 50)

if __name__ == '__main__':
    try:
        reset_admin()
    except Exception as e:
        print(f"\n✗ Error: {e}")
        print("\nAsegúrate de que la aplicación esté configurada correctamente.")
        sys.exit(1)

