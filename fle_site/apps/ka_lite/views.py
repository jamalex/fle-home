from annoying.decorators import render_to
from collections import OrderedDict
from fack.models import Question, Topic
from itertools import groupby

from django.shortcuts import get_object_or_404

from .models import UserResource

@render_to("ka_lite/faq.html")
def faq(request):
	"""Render FAQ generated by django-fack backend (override django-fack styles)"""
	topics = Topic.objects.all()
	context = {}
	for t in topics: 
		context[t] = Question.objects.filter(topic=t).active()

	return {"faq": context}

@render_to("ka_lite/user-resources.html")
def user_guides(request):
	"""Render list of user resources"""
	general_resources = UserResource.objects.filter(version='')
	versioned_resources = UserResource.objects.exclude(version__exact='')
	user_guides = {}
	
	# Group by versions
	for version, group in groupby(versioned_resources, lambda x: x.version):
		grouped_items = [g for g in group]
		user_guides[version] = grouped_items

	# Order versions
	ordered_versions = OrderedDict(sorted(user_guides.items(), reverse=True))

	return {
		"general_resources": general_resources,
		"user_guides": ordered_versions,
	}

@render_to("ka_lite/user-resource-detail.html")
def user_guide_detail(request, slug):
	"""Render detail of user resource"""
	obj = get_object_or_404(UserResource.objects.filter(slug=slug))
	related_resources = UserResource.objects.filter(version=obj.version)
	general_resources = UserResource.objects.filter(version='')
	return {
		"resource": obj,
		"related_resources": related_resources,
		"general_resources": general_resources
	}