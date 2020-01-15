$(document).ready(function() {
    var today = new Date();
    $("#date").text(today.getUTCDate() +"/" + parseFloat(today.getMonth() + 1)+ "/" + today.getFullYear());

    $("#theme").click(function() {
        $("textarea").toggleClass("stripes");
    });

    $("#border").click(function() {
        $("div[class^='col']").toggleClass("solid-border");
    });

    $("#color").change(function() {
        let color = $(this).val();
        $(".container-fluid").css("background-color", color);
    });

    $("#save-notebook").click(function() {
        if (isValidPageName())
        {
            let pagename = $("#name").val();
            if (localStorage.getItem(pagename) != null)
                $("#modal-overwrite").modal("show");
            else
                saveAll();
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

    function saveAll(page = null)
    {   
        let today = new Date();
        let prefix = "FMI_";
        let pagename = null;
        if (page == null)
            pagename = prefix + $("#name").val() +"_" + today;
        else
            pagename = page;

        let words = $("#word-area").val();
        let wordsT = $("#word-translation-area").val();
        let verbs = $("#verb-area").val();
        let verbsT = $("#verb-translation-area").val();
        let rules = $("#rule-area").val();
        let examples = $("#example-area").val();

        
        var pageObj = {};
        pageObj.words = words;
        pageObj.wordsT = wordsT;
        pageObj.verbs = verbs;
        pageObj.verbsT = verbsT;
        pageObj.rules = rules;
        pageObj.examples = examples;
        pageObj.date = today.getUTCDate() + "/" + (parseFloat(today.getMonth()+1)) + "/" +today.getFullYear();

        localStorage.setItem(pagename, JSON.stringify(pageObj));

        alert("Page was saved correctly.");
        window.location.reload();
    }

    $("#new").click(function() {
        $("input[type='text']").val("");
        $("textarea").val("");
    });

    function getAll(key)
    {
        var result = localStorage.getItem(key);
        $("#name").val(key).attr("disabled", "true");
        result = JSON.parse(result);
        console.log(result);
        if (result != null)
        {
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
            {
                $('#modal-choose-body').append("<span class='keys'>"+currentKey.toString()+"</span><hr></hr>");
                console.log(currentKey);
            }
        }
    });

    $(document).on("click", ".keys", function() {
        let key = $(this).text();
        getAll(key);
        $("#modal-choose").modal("hide");
    });

    function print(args)
    {
        for(let i = 0;i < args.length; i++)
        {
            console.log(args[i]);
        }
    }
});