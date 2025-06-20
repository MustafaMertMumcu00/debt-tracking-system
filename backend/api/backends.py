from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class EmailBackend(ModelBackend):
    """
    Kullanıcıyı `email` adresi ile doğrulayan özel bir authentication backend.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            # Gelen `username` alanının (bizim durumumuzda frontend'den gelen email)
            # email alanıyla eşleşip eşleşmediğini kontrol et.
            # `__iexact` kullanımı büyük/küçük harf duyarsız arama yapar (örn: Test@Ex.com == test@ex.com)
            user = UserModel.objects.get(email__iexact=username)
        except UserModel.DoesNotExist:
            # Kullanıcı bulunamazsa, kimlik doğrulama başarısız.
            return None
        
        # Kullanıcı bulunduysa, şifresini kontrol et.
        if user.check_password(password):
            return user # Şifre doğruysa, kullanıcı nesnesini döndür.
        return None # Şifre yanlışsa, yine başarısız.

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None