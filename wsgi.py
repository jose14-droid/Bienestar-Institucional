"""
Punto de entrada para la aplicación Flask
Optimizado para producción en Render.com
"""
from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    # En producción, Render usa Gunicorn, así que esto solo se usa en desarrollo local
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port)