"""
Management command to automatically mark loans as OVERDUE and calculate fines.
Run daily: python manage.py update_overdue_loans
Fine: 50 DZD per day past due date.
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal
from loans.models import Loan, LoanHistory

FINE_PER_DAY = Decimal('50.00')  # 50 DZD per overdue day


class Command(BaseCommand):
    help = 'Mark overdue loans and calculate fines (50 DZD/day)'

    def handle(self, *args, **options):
        today = timezone.now().date()

        # Find all loans that are past due and not yet returned
        overdue_qs = Loan.objects.filter(
            due_date__lt=today,
            status__in=['ACTIVE', 'RENEWED', 'OVERDUE']
        )

        updated = 0
        for loan in overdue_qs:
            days_overdue = (today - loan.due_date).days
            new_fine = FINE_PER_DAY * days_overdue

            changed = False

            if loan.status != 'OVERDUE':
                loan.status = 'OVERDUE'
                changed = True

            if loan.fine_amount != new_fine:
                loan.fine_amount = new_fine
                changed = True

            if changed:
                loan.save(update_fields=['status', 'fine_amount', 'updated_at'])
                LoanHistory.objects.get_or_create(
                    loan_id=loan.id,
                    action='OVERDUE',
                    defaults={
                        'details': (
                            f"{days_overdue} jour(s) de retard — "
                            f"Amende cumulée: {new_fine} DZD"
                        )
                    }
                )
                updated += 1

            self.stdout.write(
                f"  📕 Prêt #{loan.id} — {days_overdue} jrs retard — "
                f"amende: {new_fine} DZD"
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"\n✅ {updated} prêt(s) mis à jour. "
                f"{overdue_qs.count()} prêt(s) en retard au total."
            )
        )
