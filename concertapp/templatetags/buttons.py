from django import template

register = template.Library()

###
#   This is a partial template for a "large_icon_button" widget.
#
#   @param  label        String  -  the name of this button, that will be displayed
#                           to user
#   @param  id          String - the name of this button.  Will be used to populate
#                       class and id attributes
#   @param  href        String  -   the relative url that this button will link to.  #                      This is optional.
#                       TODO: Should be changed to accept a controller name instead
#                        of a string, so it can be used in the {% url %} template 
#                       tag.
#   @param  title        String  -  The title that will be displayed in a tooltip
@register.inclusion_tag('partials/large_icon_button.html')
def large_icon_button(label, id, href=None, title=None, extra_classes=None):
    return {
        'label': label, 
        'id': id, 
        'href': href, 
        'extra_classes': extra_classes, 
    }