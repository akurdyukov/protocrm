from django.contrib import admin
from crm.models import Contact

# Register your models here.
class ContactAdmin(admin.ModelAdmin):
    list_display = ('last_name','first_name')
admin.site.register(Contact, ContactAdmin)
