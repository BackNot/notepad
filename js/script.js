$(document).ready(function() {
    var today = new Date();
    $("#date").text(today.getDay() +"/" + parseFloat(today.getMonth() + 1)+ "/" + today.getFullYear());

    $("#save-notebook").click(function() {
        if (isValidPageName)
            saveAll();
        else
            alert("Please enter name of the page.");

    });

    function isValidPageName()
    {
        let nameOfPage = $("#name").val();
        if (nameOfPage === null || nameOfPage === undefined || nameOfPage == "")
            return false;
        return true;
    }

    function saveAll()
    {   
        console.log('here');
        let today = new Date();
        let pagename = $("#name").val();
        let words = $("#word-area").val();
        let wordsT = $("#word-translation-area").val();
        let verbs = $("#verb-area").val();
        let verbsT = $("#verb-translation-area").val();
        console.log(pagename);

        
        var pageObj = {};
        pageObj.words = words;
        pageObj.wordsT = wordsT;
        pageObj.verbs = verbs;
        pageObj.verbsT = verbsT;
        localStorage.setItem("FMI3.14_"+pagename+"_ "+today, JSON.stringify(pageObj));

        alert("all saved");
        //localStorage.setItem("words", words);
        //localStorage.setItem("wordsT", wordsT);
        //localStorage.setItem("verbs", verbs);
        //localStorage.setItem("verbsT", verbsT);
    }
    
    function getAll(key)
    {
        var result = localStorage.getItem(key);
        $("#name").val(key).attr("disabled", "true");
        result = JSON.parse(result);
        console.log(result);
        if (result != null)
        {
            $("#word-area").val(result.words);
            $("#word-translation-area").val(result.wordsT);
            $("#verb-area").val(result.verbs);
            $("#verb-translation-area").val(result.verbsT);
        }
    }

    $("#open").click(function(){
        $("#modal-choose").modal("show");
        $(".modal-body").text("");
        for (var i = 0; i < localStorage.length; i++) {
            let currentKey = localStorage.key(i);
            if (currentKey.slice(0,7) == "FMI3.14")
            {
                $('.modal-body').append("<span class='keys'>"+currentKey.toString()+"</span><hr></hr>");
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