function includeJsFile(filename) {
    document.write(
        '<script src="' 
            + CUI_INCLUDE_PATH + filename + 
            '" type="text/javascript"><\/script>'
    );
}
function includeAbsJsFile(filename) {
    document.write(
        '<script src="' 
            + filename + 
            '" type="text/javascript"><\/script>'
    );
}
function includeAbsCssFile(filename) {
    document.write(
        '<link href="'
            + filename + 
        '" rel="stylesheet" type="text/css">'
    );
}
function includeCssFile(filename) {
    document.write(
        '<link href="'
            + CUI_INCLUDE_PATH + filename + 
        '" rel="stylesheet" type="text/css">'
    );
}

includeAbsJsFile("https://maps.googleapis.com/maps/api/js?key=AIzaSyCRMz0xxBvCrYp4K_iYu1ncN8lHM6ITnYY");
includeAbsCssFile("//fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,700|ABeeZee|Titillium+Web:200,300,400,700");

includeJsFile("/cui_nav_state.js");
includeJsFile("/cui_node.js");

includeJsFile("/nodes/generic/cui_button.js");
includeJsFile("/nodes/generic/cui_dropdown.js");
includeJsFile("/nodes/generic/cui_option.js");
includeJsFile("/nodes/generic/cui_popup.js");
includeJsFile("/nodes/generic/cui_switcher.js");
includeJsFile("/nodes/generic/cui_toggle.js");
includeJsFile("/nodes/generic/cui_wrapper.js");

includeJsFile("/nodes/layout/cui_quad_layout.js");
includeJsFile("/nodes/layout/cui_canvas.js");
includeJsFile("/nodes/layout/cui_u_layout.js");
includeJsFile("/nodes/test/cui_hello.js");
includeJsFile("/nodes/test/cui_hello_list.js");

includeJsFile ("/nodes/cloudvar_widget/cui_cloudvar_widget.js");
includeCssFile ("/nodes/cloudvar_widget/cui_cloudvar_widget.css");
includeJsFile ("/nodes/topbar/cui_topbar.js");
includeJsFile ("/nodes/topbar/cui_app_dropdown.js");
includeJsFile ("/nodes/topbar/cui_user_dropdown.js");
includeCssFile("/nodes/topbar/cui_topbar.css");
includeCssFile("/nodes/topbar/cui_topbar_submenu.css");
includeCssFile("/nodes/topbar/cui_app_dropdown.css");
includeCssFile("/nodes/topbar/cui_user_dropdown.css");

includeCssFile("/nodes/generic/cui_generic.css");

includeJsFile ("/nodes/viz/cui_map.js");
includeCssFile("/nodes/viz/cui_map.css");

includeCssFile("/nodes/layout/cui_layout.css");

includeCssFile("/cui_base.css");
