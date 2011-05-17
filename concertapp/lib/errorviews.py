from django.http import HttpResponse, HttpResponseRedirect


def csrf_failure(request, reason=""):
    return HttpResponse(reason)