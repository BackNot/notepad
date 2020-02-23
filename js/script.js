$(document).ready(function() {

    // Parse today date in the page
    var today = new Date();
    $("#date").text(today.getUTCDate() +"/" + parseFloat(today.getMonth() + 1)+ "/" + today.getFullYear());

    // Check sesionStorage for user customized theme settings
    if (sessionStorage.getItem("stripes") != null)
        $("textarea").addClass("stripes");

    if (sessionStorage.getItem("border") != null)
    {
        let removeBorder = sessionStorage.getItem("border");
        if (removeBorder == "true")
            $("div[class^='col']").removeClass("solid-border");
        else
            $("div[class^='col']").addClass("solid-border");
    }

    if (sessionStorage.getItem("stripes") != null)
        $("textarea").addClass("stripes");

    if (sessionStorage.getItem("pageColor") != null)
        $(".container-fluid").css("background-color", sessionStorage.getItem("pageColor"));

    if (sessionStorage.getItem("boxColor") != null)
        $("textarea").removeClass("stripes").css("background-color", sessionStorage.getItem("boxColor"));

    $("#theme").click(function() { 
        $("textarea").toggleClass("stripes");

        if (sessionStorage.getItem("stripes") != null)
            sessionStorage.removeItem("stripes");
        else
            sessionStorage.setItem("stripes", "true");

        sessionStorage.removeItem("boxColor");
    });

    $(".delete-notebook").click(function() {
        let key = $(this).parent().attr("data-record");
        if (key == null || key == undefined || key == "")
            alert("Select a record first");
        else {
            $("#modal-choose").modal("hide");
            $("#modal-deletion-one").modal("show");
            $("#btn-delete-one-confirm").attr("data-record", key);
        }
    });

    $("#btn-delete-one-confirm").click(function() {
        let key = $(this).attr("data-record");
        if (key == null || key == undefined || key == "")
            return;
        localStorage.removeItem(key);
        alert("Page deleted.");
        window.location.reload();
    });

    $("#border").click(function() {
        $("div[class^='col']").toggleClass("solid-border");

        if (sessionStorage.getItem("border") != null)
            sessionStorage.removeItem("border");
        else
            sessionStorage.setItem("border", "true");
    });

    $("#customize").click(function() {
        $("#modal-theme").modal("show");
    });

    $("#page-color").change(function() {
        let color = $(this).val();
        $(".container-fluid").css("background-color", color);

        if (sessionStorage.getItem("pageColor") != null)
            sessionStorage.removeItem("pageColor");
        else
            sessionStorage.setItem("pageColor", color);
    });

    $("#boxes-color").change(function() {
        let color = $(this).val();
        $("textarea").removeClass("stripes").css("background-color", color);

        if (sessionStorage.getItem("boxColor") != null)
            sessionStorage.removeItem("boxColor");
        else
            sessionStorage.setItem("boxColor", color);
        sessionStorage.removeItem("stripes");
    });

    $(".save-notebook").click(function() {
        let refreshPage = $(this).attr("data-refresh");
        if (isValidPageName())
        {
            let pagename = $("#name").val();
            if (localStorage.getItem(pagename) != null)
                $("#modal-overwrite").modal("show");
            else
                saveAll(null, refreshPage);
        }
        else
            alert("Please enter name of the page.");
    });

    $("#btn-overwrite").click(function() {
        saveAll($("#name").val());
    });

    $("#btn-delete").click(function() {
        $("#modal-choose").modal("hide");
        $("#modal-deletion").modal("show");
    });

    $("#btn-delete-confirm").click(function() {
        localStorage.clear();
        $("#modal-deletion").modal("hide");
        alert("Everything was deleted.")
    });

    function isValidPageName()
    {
        let nameOfPage = $("#name").val();
        if (nameOfPage === null || nameOfPage === undefined || nameOfPage == "")
            return false;
        return true;
    }

    function saveAll(page = null, refresh = false)
    {   
        let today = new Date();
        let timestampt = today.getUTCDate() + "/" + (parseFloat(today.getMonth()+1)) + "/" +
        + today.getFullYear() + "_" + today.getHours() + ":" + today.getMinutes() + ":" + 
        + today.getSeconds();

        let prefix = "FMI_";
        let pagename = null;
        let pageNameToBeShown = null
        if (page == null) {
            pagename = prefix + $("#name").val() +"_" + timestampt;
            pageNameToBeShown = $("#name").val();
        }
        else {
            pagename = page;
            pageNameToBeShown = page;
        }

        let words = $("#word-area").val();
        let wordsT = $("#word-translation-area").val();
        let verbs = $("#verb-area").val();
        let verbsT = $("#verb-translation-area").val();
        let rules = $("#rule-area").val();
        let examples = $("#example-area").val();
        
        var pageObj = {};
        pageObj.realName = pageNameToBeShown;
        pageObj.words = words;
        pageObj.wordsT = wordsT;
        pageObj.verbs = verbs;
        pageObj.verbsT = verbsT;
        pageObj.rules = rules;
        pageObj.examples = examples;
        pageObj.date = today.getUTCDate() + "/" + (parseFloat(today.getMonth()+1)) + "/" +today.getFullYear();

        localStorage.setItem(pagename, JSON.stringify(pageObj));

        alert("Page was saved correctly.");
        if (refresh == "true")
            window.location.reload();
        else
            $("#modal-overwrite").modal("hide");
    }

    $("#new").click(function() {
        $("input[type='text']").val("").attr("disabled", false);
        $("textarea").val("");
    });

    function getAll(key)
    {
        var result = localStorage.getItem(key);
        result = JSON.parse(result);
        if (result != null)
        {
            $("#name").val(key).attr("disabled", "true");
            $("#date").text(result.date);
            $("#rule-area").val(result.rules);
            $("#example-area").val(result.examples);
            $("#word-area").val(result.words);
            $("#word-translation-area").val(result.wordsT);
            $("#verb-area").val(result.verbs);
            $("#verb-translation-area").val(result.verbsT);
        }
    }

    $("#open").click(function(){
        $("#modal-choose").modal("show");
        $("#modal-choose-body").text("");
        for (var i = 0; i < localStorage.length; i++) {
            let currentKey = localStorage.key(i);
            if (currentKey.startsWith("FMI_"))
                $('#modal-choose-body').append("<span class='keys'>"+currentKey.toString()+"</span><hr></hr>");
        }
    });

    $(document).on("click", "html", function() {
        $("#action-btns").attr("data-record", "");
        $(".keys").removeClass("lightgrey-background");
    });

    $(document).on("click", ".keys", function(e) {
        let key = $(this).text();
        e.stopPropagation();
        $("#action-btns").attr("data-record", key);
        $(".keys").removeClass("lightgrey-background");
        $(this).addClass("lightgrey-background");
    });

    $(".open-notebook").click(function() {
        let key = $(this).parent().attr("data-record");
        if (key == null || key == undefined || key == "")
            alert("Select a record first");
        else {
            getAll(key);
            $("#modal-choose").modal("hide");
        }
    });

    $(".export-notebook").click(function() {
        let key = $(this).parent().attr("data-record");
        if (key == null || key == undefined || key == "")
            alert("Select a record first");
        else {
            let newDocument = new jsPDF();
            
            var result = localStorage.getItem(key);
            result = JSON.parse(result);
            console.log(result);
            newDocument.text("Name: " + result.realName, 10, 10);
            newDocument.text("Date:" + result.date, 10, 20);
            newDocument.text("Rules:", 10, 30);
            newDocument.text(result.rules, 10, 40);
            newDocument.text("Examples:", 10, 60);
            newDocument.text(result.examples, 10, 70);
            newDocument.text("Words:", 10, 90);
            newDocument.text(result.words, 10, 100);
            newDocument.text("Translations:", 10, 120);
            newDocument.text(result.wordsT, 10, 130);
            newDocument.text("Verbs:", 10, 150);
            newDocument.text(result.verbs, 10, 160);
            newDocument.text("Translations:", 10, 180);
            newDocument.text(result.verbsT, 10, 190);

            newDocument.save("notavirus.pdf");
        }
    });
});