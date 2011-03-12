from django import template
from django.template.loader import render_to_string

register = template.Library()


def get_widget(parser, token):
    try:
        import sys
        print >> sys.stderr, "token.split_contents():\n"+str(token.split_contents())
        sys.stderr.flush()
        tag_name, template_location, widgetType = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError, "%r tag requires two arguments" % token.contents.split()[0]
    
    def is_quoted(a_string):
        if (a_string[0] == a_string[-1] and a_string[0] in ('"', "'")):
            return True
        return False

    if not is_quoted(template_location):
        raise template.TemplateSyntaxError, "%r, widget's 1st argument should be in quotes" % template_location
    if not is_quoted(widgetType): 
        raise template.TemplateSyntaxError, "%r, widget's 2nd argument should be in quotes" % widgetType

    return WidgetNode(template_location[1:-1], widgetType[1:-1])

###
#   A Widget node renders the given template, 
#   setting 'widgetType' variables and passing the context of the calling template.
#    Basically a django {% include %} with a custom context for widgetType.
class WidgetNode(template.Node):
    def __init__(self, template_location, widgetType):
        self.template_location = template_location
        self.widgetType = widgetType
    def render(self, context):
        return render_to_string(self.template_location, {'widgetType': self.widgetType}, context)

register.tag('widget', get_widget)

