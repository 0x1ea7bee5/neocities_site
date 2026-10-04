#!/bin/bash

: '
This is a script that iterates through all of the webpages, and finds references to other webpages.
This then dumps everything to an xml file to be used by the navigation web
There is only client side javascript support, so link finding on my own
machine will roughly do what I want, so long as I do not forgor to run the bash script whenever
making an update
'

output_fpath="link_references.xml"

#function
function get_linx {
    # parameters are numbered.
    local filename="$1"
    html_hits=$(pcregrep -o1 "href=\"(/.+\.html)\"" "$1")
    echo "$html_hits"
}


#main
xml_str="<?xml version=\"1.0\" encoding=\"utf-8\"?><root_node>"
cur_dir=$(pwd)
echo "Current directory $cur_dir"
all_html_filepaths=$(find "$cur_dir" | grep "html")

for file in $all_html_filepaths; do
    relative_fname=$(echo $file | pcregrep -o1 "$cur_dir(/.+\.html)" )
    #need to replace all slashes with something else, and remove the initial slash. Must put it back
    #relative_fname=$(echo $relative_fname | tr "/" ".")
    linknames=$(get_linx $file)
    #xml_str="$xml_str<node><parent_link>eeee</parent_link>"
    xml_str="$xml_str<node><parent_link>$relative_fname</parent_link>"
    for ref_link in $linknames; do
        #xml_str="$xml_str<child_link>yyyy</child_link>"
        xml_str="$xml_str<child_link>$ref_link</child_link>"
    done
    xml_str="$xml_str</node>"
done
xml_str="$xml_str</root_node>"
echo $xml_str > $output_fpath
#cat <<\EOF >> $output_fpath

