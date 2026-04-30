import os
import subprocess
import sys

base_dir = os.getcwd()
services = [
    "user_service",
    "books_service",
    "loans_service",
    "library_notifications_service"
]

python_exe = os.path.join(base_dir, "venv", "Scripts", "python.exe")

for service in services:
    print(f"--- Migrating {service} ---")
    service_path = os.path.join(base_dir, service)
    os.chdir(service_path)
    
    # Run migrations
    subprocess.run([python_exe, "manage.py", "makemigrations"])
    subprocess.run([python_exe, "manage.py", "migrate"])
    
    # Create superuser for user_service
    if service == "user_service":
        print("Creating admin user...")
        # We'll use a shell command to create the user non-interactively
        create_user_cmd = f"from users.models import User; User.objects.create_superuser('admin@biblio.local', 'admin123')"
        subprocess.run([python_exe, "manage.py", "shell", "-c", create_user_cmd])
        
        print("Creating librarian user...")
        create_lib_cmd = f"from users.models import User; User.objects.create_user(email='librarian@biblio.local', password='lib123', role='Librarian')"
        subprocess.run([python_exe, "manage.py", "shell", "-c", create_lib_cmd])

    os.chdir(base_dir)

print("All migrations completed.")
