(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["templates/kit.html"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">\n  <meta content=\"kit\" name=\"webmaker:tags\">\n  ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "tags");
if(t_3) {for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("tag", t_4);
output += "\n    <meta content=\"";
output += runtime.suppressValue(t_4, env.autoesc);
output += "\" name=\"webmaker:tags\">\n  ";
;
}
}
frame = frame.pop();
output += "\n  <link href=\"";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "webmakerKitsCSS")?runtime.contextOrFrameLookup(context, frame, "webmakerKitsCSS"):"/vendor/webmaker-kits/dist/css/style.css"), env.autoesc);
output += "\" media=\"all\" rel=\"stylesheet\" type=\"text/css\">\n  <title>";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "title")?runtime.contextOrFrameLookup(context, frame, "title"):"Teaching Kit"), env.autoesc);
output += "</title>\n</head>\n<body>\n<div id=\"ribbon\">Teaching Kit</div>\n<header style=\"background-image:url(";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "headerImage")?runtime.contextOrFrameLookup(context, frame, "headerImage"):"https://s3-us-west-2.amazonaws.com/webmaker-kits/learning%402x.jpg"), env.autoesc);
output += ")\">\n  <hgroup>\n    <h1>";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "title")?runtime.contextOrFrameLookup(context, frame, "title"):"Your title goes here"), env.autoesc);
output += "</h1>\n    <h2>";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "summary")?runtime.contextOrFrameLookup(context, frame, "summary"):"Give it a one-line summary here. What will participants make or learn?"), env.autoesc);
output += "</h2>\n    <h3 id=\"made-by\">";
if(runtime.contextOrFrameLookup(context, frame, "authors")) {
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "authors"), env.autoesc);
;
}
else {
output += "Made by <a href=\"http://example.com\">your name</a>.";
;
}
output += "</h3>\n  </hgroup>\n\n</header>\n<div class=\"wrapper\">\n  <div class=\"row\">\n    <main>\n      <h2>Description</h2>\n      ";
if(runtime.contextOrFrameLookup(context, frame, "description")) {
output += "\n        ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "description"), env.autoesc);
output += "\n      ";
;
}
else {
output += "\n        <p>\n          What is your teaching kit all about? What does it help people make or learn? What was your inspiration for creating it?\n        </p>\n      ";
;
}
output += "\n\n      <h2>Learning objectives</h2>\n      ";
if(runtime.contextOrFrameLookup(context, frame, "objectives")) {
output += "\n       ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "objectives"), env.autoesc);
output += "\n      ";
;
}
else {
output += "\n        <p>\n          What specific skills will participants learn? What new knowledge will they come away with? You might want to list these individually, like this:\n        </p>\n        <ul>\n          <li>Skill 1</li>\n          <li>Skill 2</li>\n          <li>Skill 3</li>\n        </ul>\n        <p>\n          Not sure? Have a look at our new <a href=\"https://wiki.mozilla.org/Learning/WebLiteracyStandard\">Web Literacy Standard</a>.\n        </p>\n      ";
;
}
output += "\n\n      <h2>Agenda</h2>\n      ";
if(runtime.contextOrFrameLookup(context, frame, "agenda")) {
output += "\n        ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "agenda"), env.autoesc);
output += "\n      ";
;
}
else {
output += "\n        <ol class=\"agenda\">\n          <li><a href=\"#\">Activity 1</a></li>\n          <li><a href=\"#\">Activity 2</a></li>\n          <li><a href=\"#\">Activity 3</a></li>\n          <li><a href=\"#\">Activity 4</a></li>\n        </ol>\n      ";
;
}
output += "\n\n      <h2>What you'll make together</h2>\n      ";
if(runtime.contextOrFrameLookup(context, frame, "outcomes")) {
output += "\n        ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "outcomes"), env.autoesc);
output += "\n      ";
;
}
else {
output += "\n        <p>\n          What will participants make? What's the end result or finished product? A web page? Video? Paper prototype? Dancing robots? :)\n        </p>\n      ";
;
}
output += "\n\n      <h2>Preparation</h2>\n      ";
if(runtime.contextOrFrameLookup(context, frame, "preparation")) {
output += "\n        ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "preparation"), env.autoesc);
output += "\n      ";
;
}
else {
output += "\n        <p>\n          Are any special materials required? What tools will participants need? Should anything be set up in advance? Is there any software to install, or specific technical requirements?\n        </p>\n      ";
;
}
output += "\n\n      <h2>Assessment and review</h2>\n      ";
if(runtime.contextOrFrameLookup(context, frame, "assessment")) {
output += "\n        ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "assessment"), env.autoesc);
output += "\n      ";
;
}
else {
output += "\n        <p>\n          How can participants assess and reflect on their work once it's complete? Feel free to add here if you have suggestions for...\n        </p>\n        <ul>\n          <li><strong>Discussion questions</strong>. Any suggested topics or questions for follow-up discussion?</li>\n          <li><strong>Assessment</strong>. Is there a specific standard or rubric you'd suggest using?\n            Are there ways learners can assess each others' work? (Peer assessment?)</li>\n            <li><strong>Sharing</strong>. What are some good ways participants can publish and share what they made?</li>\n        </ul>\n      ";
;
}
output += "\n\n      <h2>Assessment criteria</h2>\n      <div class=\"well checklist\">\n        ";
if(runtime.contextOrFrameLookup(context, frame, "criteria")) {
output += "\n          ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "criteria"), env.autoesc);
output += "\n        ";
;
}
else {
output += "\n          <p>\n            Got a check-list of criteria, or things to look for in a great completed project? Feel free to list them here:\n          </p>\n          <ul>\n            <li>Criteria 1</li>\n            <li>Criteria 2</li>\n            <li>Criteria 3</li>\n          </ul>\n        ";
;
}
output += "\n      </div>\n    </main>\n\n    <aside>\n      <section class=\"tags\" id=\"magicTags\">\n        <h2>Tags</h2>\n        <p id=\"magicNotice\" class=\"well yellow\"><em>This section will automagically be populated with this kits tags.</em></p>\n      </section>\n\n      <section class=\"teach-list\">\n        <h2>Additional Resources</h2>\n        ";
if(runtime.contextOrFrameLookup(context, frame, "resources")) {
output += "\n          ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "resources"), env.autoesc);
output += "\n        ";
;
}
else {
output += "\n          <ul>\n            <li><a href=\"http://foo.org/\">You can include LINKS...</a></li>\n            <li><a href=\"http://foo.org/\">...to supporting pages and helpful resources...</a></li>\n            <li><a href=\"http://foo.org/\">...in this section</a></li>\n          </ul>\n        ";
;
}
output += "\n      </section>\n\n      <section class=\"teach-list\">\n        <h2>Tips and tricks</h2>\n        ";
if(runtime.contextOrFrameLookup(context, frame, "tips")) {
output += "\n          ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "tips"), env.autoesc);
output += "\n        ";
;
}
else {
output += "\n          <ul>\n            <li><a href=\"https://support.mozilla.org/en-US/kb/top-tips-creating-great-teaching-kits\">Tips for creating great teaching kits</a></li>\n            <li><a href=\"https://support.mozilla.org/en-US/kb/pro-tips-webmaker-teaching-kits\">Pro Tips for great teaching kits</a></li>\n            <li><a href=\"https://webmaker.org/event-guides\">Event Guides</a></li>\n          </ul>\n        ";
;
}
output += "\n      </section>\n    </aside>\n    </div>\n  </div>\n  <script src=\"";
output += runtime.suppressValue((runtime.contextOrFrameLookup(context, frame, "webmakerKitsJS")?runtime.contextOrFrameLookup(context, frame, "webmakerKitsJS"):"/vendor/webmaker-kits/dist/js/main.min.js"), env.autoesc);
output += "\"></script>\n</body>\n</html>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
