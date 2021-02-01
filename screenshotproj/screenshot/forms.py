from django import forms
from django.core import validators

class ScreenshotForm(forms.Form):

    target_url = forms.URLField(
        max_length=500,
        min_length=5,
        widget=forms.URLInput(
            attrs={
                'class': 'form-control'
            }
        )
    )

    height = forms.IntegerField(
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control',
                'value': '1080'
            }
        ),
        validators=[validators.MinValueValidator(420)]
    )

    width = forms.IntegerField(
        widget=forms.NumberInput(
            attrs={
                'class': 'form-control',
                'value': '1920'
            }
        ),
        validators=[validators.MinValueValidator(420)]
    )