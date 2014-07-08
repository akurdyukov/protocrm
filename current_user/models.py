from django.db import models
from django.contrib.auth.models import User

from current_user import registration


class CurrentUserField(models.ForeignKey):
    def __init__(self, auto_update = True, **kwargs):
        kwargs['null'] = True
        if 'to' in kwargs:
            del kwargs['to']
        super(CurrentUserField, self).__init__(User, **kwargs)
        self._auto_update = auto_update

    @property
    def is_auto_update(self):
        return self._auto_update

    def contribute_to_class(self, cls, name, **kwargs):
        super(CurrentUserField, self).contribute_to_class(cls, name)
        registry = registration.FieldRegistry()
        registry.add_field(cls, self)

from south.modelsinspector import add_introspection_rules
add_introspection_rules([], ["current_user.models.CurrentUserField"])
