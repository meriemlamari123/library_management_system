"""
Django management command to start the Loan Service RabbitMQ consumer
Usage: python manage.py start_loan_consumer
"""

from django.core.management.base import BaseCommand
from loans.consumer import LoanConsumer
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Starts the Loan Service RabbitMQ Consumer'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('--- Démarrage du Loan Service Consumer ---'))
        self.stdout.write('1. Initialisation du client...')
        try:
            from loans.consumer import LoanConsumer
            consumer = LoanConsumer()
            
            self.stdout.write('2. Connexion à RabbitMQ en cours...')
            # Le démarrage effectif se fait ici
            consumer.start()
            
        except KeyboardInterrupt:
            self.stdout.write(self.style.SUCCESS('\nArrêté par l\'utilisateur.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\nERREUR CRITIQUE : {e}'))
            import traceback
            self.stdout.write(traceback.format_exc())
