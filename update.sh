#! /bin/bash

# The path to your jsdoc-toolkit folder (no ending slash)
JSTOOLKIT_ROOT='/opt/local/bin/jsdoc-toolkit'


# Grab concertapp directory from master
echo 'Updating code from master'
git fetch
git checkout master concertapp/

# Remove vendor client side code (we dont need to document any)
rm -R concertapp/static/js/lib/vendor/

cd documentation/

# Remove current clientside documentation
rm -Rf clientside/*
# Generate new client-side documentation
echo 'Generating client side documentation'
java -jar $JSTOOLKIT_ROOT/jsrun.jar $JSTOOLKIT_ROOT/app/run.js -a -p -r -d=clientside ../concertapp/static/js/ -t=$JSTOOLKIT_ROOT/templates/jsdoc/

# Remove current clientside documentation
rm -Rf serverside/*
# Generate the server-side documentation
echo 'Generating server side documentation'
doxygen Concert.cfg

# Re-render all diagrams
cd diagrams/
for dia in *.dia
do
  echo "Processing diagram $dia"
  svg=${dia%.dia}.svg
  echo "Deleting $svg"
  rm $svg
  echo "Converting $dia to SVG"
  dia --export=$svg --filter=svg $dia
done

cd ../../

# Remove code, just keep documentation
rm -rf concertapp/

# Add changes
echo 'Adding new documentation and diagrams to git'
git add .

# commit and push?
echo 'Documentation has been updated.  Commit and push?'
answer=0
while [[ $answer != 'y' && $answer != 'n' ]]
do
    echo '[y/n]:'
    read answer
done

if [[ $answer == 'y' ]]; then
    echo 'Committing'
    git commit -a -m 'Documentation update.'

    # Push
    echo 'Pushing'
    git push origin gh-pages
fi

echo 'Goodbye!'
