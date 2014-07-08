from rest_framework import serializers

class MultiEmailField(serializers.WritableField):
    def to_native(self, obj):
        return obj

    def from_native(self, data):
        return data
