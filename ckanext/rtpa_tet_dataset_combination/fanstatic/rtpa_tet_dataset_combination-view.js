		        console.log("IN")
$(function(){
    
    if(true){

        var editor = ace.edit("adv-query-editor");
        editor.getSession().setMode("ace/mode/sql");


        $('a[href="#sqlquery"]').click(function (e) {
            var sql = $('#query-editor').queryBuilder('getSQL').sql;
            sql = 'SELECT  * from  ' + '"' + resource_id + '" WHERE ' +sql;
            sql = sql.replace(new RegExp("_", 'g'), '"');
            editor.setValue(sql, 1)
        });

        $("#adv-exe-query").click(function(e){
            sql_api = $("#query-api").val() + "?sql=" + encodeURIComponent(editor.getValue());
            $("#adv-query-output").html("");
            var jqxhr = $.get(sql_api, function (data){
                var tr = "";
                var table = "";
                if (data["success"] == true){
                   for(field in data["result"]["fields"]){
                    if (data["result"]["fields"][field]["id"] .startsWith("_")) continue;
                     tr += "<th>" + data["result"]["fields"][field]["id"] + "</th>";
                   }
                }
                table += "<tr>" + tr + "</tr>";
                tr=""
                for(record  in data["result"]["records"]){
                   for(field in data["result"]["fields"]){
                    var field_id = data["result"]["fields"][field]["id"];
                    if (field_id.startsWith("_")) continue;
                    tr += "<td>" + data["result"]["records"][record][field_id] + "</td>"
                   }
                   table += "<tr>" + tr + "</tr>";
                   tr=""
                }
                table = "<table class='table table-hover' width='100%'>"  + table + "</table>";
                $("#adv-query-output").html(table);
            }).fail(function() {
                $("#adv-query-output").html('<div class="alert alert-danger"><strong>Error</strong> Failed to excute the query </div>');
            });;
        });
    }

    
    
    
    $("#trigger-create-form").submit(function(e){
        e.preventDefault(e);
    });

    //Query Builder
    if($("#query-editor").length > 0){

        var resource_id

        url = $( "#api-link" ).val();

        $.get(url, function(data){
            resource_id = data.result.resource_id;

            var to_be_removed = 0;

            for (field in data.result.fields){
                if (data.result.fields[field]["id"] == '_id'){
                    to_be_removed = field
                    continue;
                }
                data.result.fields[field]["label"] = data.result.fields[field]["id"];
                data.result.fields[field]["id"] = "_" + data.result.fields[field]["id"] + "_";

                // TODO switch + default string
                if (data.result.fields[field]["type"] == "int4"){
                    data.result.fields[field]["type"] = "integer"
                }
                if (data.result.fields[field]["type"] == "text"){
                    data.result.fields[field]["type"] = "string"
                }
                if (data.result.fields[field]["type"] == "timestamp"){
                    data.result.fields[field]["type"] = "time"
                }
                if (data.result.fields[field]["type"] == "numeric"){
                    data.result.fields[field]["type"] = "double"
                }
            }
            data.result.fields.splice(to_be_removed, 1);
            $("#query-editor").queryBuilder({filters:data.result.fields});
        });

        $("#trigger").click(function(e){
             $( "#trigger-form" ).toggle( "slow", function() {});
        });

        $("#trigger-create").click(function(e){
            var sql = $('#query-editor').queryBuilder('getSQL').sql;
            sql = sql.replace(new RegExp("_", 'g'), '"');
            email = $("#trigger-email").val()
            notification = $("#trigger-text").val()
            $("#trigger-create").prop('disabled', true);
            $.ajax({
                url: '/en/create_trigger',
                type: 'POST',
                data: {
                    "sql":sql,
                    "email": email,
                    "notification" : notification,
                    'csrfmiddlewaretoken': csrftoken
                },
                dataType: 'json',
                success: function (result){
                    if (result.success){
                        $("#trigger-output").html('<div class="alert alert-success">' + result.message + '</div>');
                        $( "#trigger-form" ).toggle( 1300, function() {
                            $("#trigger-output").html('');
                        });
                    }else{
                        $("#trigger-output").html('<div class="alert alert-error">' + result.message + '</div>');
                    }
                    $("#trigger-create").prop('disabled', false);
                }
            }).fail(function() {
                $("#trigger-output").html('<div class="alert alert-error">Failed</div>');
                $("#trigger-create").prop('disabled', false);
            });
        });


        $("#download").click(function(e){
            var sql = $('#query-editor').queryBuilder('getSQL').sql;
            sql = 'SELECT  * from  ' + '"' + resource_id + '" WHERE ' +sql;
            sql = sql.replace(new RegExp("_", 'g'), '"');
            var form = $('<form></form>').attr('action', '/en/download').attr('method', 'post');
            form.append($("<input></input>").attr('type', 'hidden').attr('name', 'sql').attr('value', sql));
            form.append($("<input></input>").attr('type', 'hidden').attr('name', 'csrfmiddlewaretoken').attr('value', csrftoken));
            form.appendTo('body').submit().remove();
        });

        $("#exe-query").click(function(e){
            console.log( resource_id )
            var sql = $('#query-editor').queryBuilder('getSQL').sql;
            sql = 'SELECT  * from  ' + '"' + resource_id + '" WHERE ' +sql;
            console.log( resource_id )
            sql = sql.replace(new RegExp("_", 'g'), '"');
            sql_api = $("#query-api").val() + "?sql=" + encodeURIComponent(sql);
            $("#query-output").html("");
            var jqxhr = $.get(sql_api, function (data){
                var tr = "";
                var table = "";
                if (data["success"] == true){
                   for(field in data["result"]["fields"]){
                    if (data["result"]["fields"][field]["id"] .startsWith("_")) continue;
                     tr += "<th>" + data["result"]["fields"][field]["id"] + "</th>";
                   }
                }
                table += "<tr>" + tr + "</tr>";
                tr=""
                for(record  in data["result"]["records"]){
                   for(field in data["result"]["fields"]){
                    var field_id = data["result"]["fields"][field]["id"];
                    if (field_id.startsWith("_")) continue;
                    tr += "<td>" + data["result"]["records"][record][field_id] + "</td>"
                   }
                   table += "<tr>" + tr + "</tr>";
                   tr=""
                }
                table = "<table class='table table-hover' width='100%'>"  + table + "</table>";
                $("#query-output").html(table);
            }).fail(function() {
                $("#query-output").html('<div class="alert alert-danger"><strong>Error</strong> Failed to excute the query </div>');
            });;
        });
    }
    
}
