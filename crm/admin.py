from django.contrib import admin
from crm.models import Contact, ContactEmail

# Register your models here.
admin.site.register(Contact)
admin.site.register(ContactEmail)