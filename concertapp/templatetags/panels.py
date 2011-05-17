from django import template
from django.template.loader import render_to_string

register = template.Library()


###
#   Parser for the panel2 tag
def get_panel(parser, token):
    try:
        tag_name, template_location, title, id = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError, "%r tag requires a two arguments" % token.contents.split()[0]
    
    def is_quoted(a_string):
        if (a_string[0] == a_string[-1] and a_string[0] in ('"', "'")):
            return True
        return False

    if not is_quoted(template_location):
        raise template.TemplateSyntaxError, "%r tag's 1st argument should be in quotes" % tag_name
    if not is_quoted(title):
        raise template.TemplateSyntaxError, "%r tag's 3rd argument should be in quotes" % tag_name
    if not is_quoted(id): 
        raise template.TemplateSyntaxError, "%r tag's 2nd argument should be in quotes" % tag_name

    return PanelNode(template_location[1:-1], title[1:-1], id[1:-1])

###
#   A Panel node renders the given template setting 'id' and 'title' variables and passing the context of
#   calling template.  Basically a django {% include %} with a custom context for id and title
class PanelNode(template.Node):
    def __init__(self, template_location, title, id):
        self.template_location = template_location
        self.id = id
        self.title = title
    def render(self, context):
        return render_to_string(self.template_location, {'id': self.id, 'title':self.title}, context)

register.tag('panel', get_panel)

