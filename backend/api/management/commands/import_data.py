import json
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Customer

class Command(BaseCommand):
    help = 'Imports data from db.json into the database'

    def handle(self, *args, **options):
        self.stdout.write("Starting data import...")

        with open('db.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Kullanıcıları import et
        # api/management/commands/import_data.py

        for user_data in data['users']:
            # Email'i hem username hem de email alanı için kullan ve küçük harfe çevir (mailler harfe duyarsızdır).
            email = user_data.get('email')
            if not email:
                self.stdout.write(self.style.WARNING(f"Skipping user with no email: {user_data.get('name')}"))
                continue

            user, created = User.objects.get_or_create(
                email__iexact=email.lower(), # Kullanıcıyı e-postasına göre bul
                defaults={
                    'username': email.lower(), # Yeni oluşturuluyorsa username'i e-postası yap
                    'email': email.lower(),
                    'first_name': user_data.get('name', '') # İsmi de first_name'e kaydet
                }
            )
            if created:
                user.set_password('password')
                user.save()
                self.stdout.write(f"Created user: {user.username}")

        # Müşterileri import et
        for user_id_str, customers_list in data['customers'].items():
            try:
                user_email = next(u['email'] for u in data['users'] if u['id'] == user_id_str)

                user = User.objects.get(email__iexact=user_email)

                for cust_data in customers_list:
                    if not Customer.objects.filter(id_from_json=cust_data['id']).exists():
                        Customer.objects.create(
                            user=user,
                            id_from_json=cust_data['id'],
                            accountCode=cust_data['accountCode'],
                            name=cust_data['name'],
                            phone=cust_data.get('phone', ''),
                            balance=cust_data['balance'],
                            lastInvoiceDate=cust_data.get('lastInvoiceDate'),
                            lastPaymentDate=cust_data.get('lastPaymentDate'),
                            status=cust_data['status']
                        )
                        self.stdout.write(f"  - Imported customer: {cust_data['name']} for user {user.username}")

            except (StopIteration, User.DoesNotExist):
                # Güvenlik önlemi
                self.stdout.write(self.style.WARNING(f"Could not find user or user_email for id {user_id_str} in db.json"))

        self.stdout.write(self.style.SUCCESS('Data import finished!'))

# Eğer veritabanını sildiysen -> python manage.py migrate eğer silmediysen bu satırı geç.
# JSON'ı güncelle.
# Terminalde python manage.py import_data yaz
# Bu sayede JSON'daki değişiklikler django veritabanına aktarılır.