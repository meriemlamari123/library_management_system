from django.core.management.base import BaseCommand
from users.models import User, Group

class Command(BaseCommand):
    help = 'Creates default admin and member users'

    def handle(self, *args, **options):
        # 1. Create Admin User
        admin_email = 'admin@library.com'
        if not User.objects.filter(email=admin_email).exists():
            admin_user = User.objects.create_superuser(
                email=admin_email,
                password='Admin123!',
                role='ADMIN',
                first_name='System',
                last_name='Admin'
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created admin user: {admin_email}'))
        else:
            self.stdout.write(self.style.WARNING(f'Admin user already exists: {admin_email}'))

        # 2. Create Regular Member User
        user_email = 'user@library.com'
        if not User.objects.filter(email=user_email).exists():
            member_user = User.objects.create_user(
                email=user_email,
                password='User123!',
                role='MEMBER',
                first_name='Library',
                last_name='User'
            )
            
            # Assign to MEMBER group
            member_group = Group.objects.filter(name='MEMBER').first()
            if member_group:
                member_user.custom_groups.add(member_group)
                self.stdout.write(self.style.SUCCESS(f'Successfully created member user: {user_email}'))
            else:
                self.stdout.write(self.style.ERROR('MEMBER group not found. Run project to auto-create groups first.'))
        else:
            self.stdout.write(self.style.WARNING(f'Member user already exists: {user_email}'))
