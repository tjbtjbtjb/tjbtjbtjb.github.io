var LiteCartInterface = {};

LiteCartInterface.req_interface_URL = "/litecart/JSInterface.cfm";
LiteCartInterface.lorefkey = "";


/* ADD PRODUCT */
LiteCartInterface.AddProduct=function(productid, qty, size){
	$.post(LiteCartInterface.req_interface_URL, { action: "Add", "lorefkey":LiteCartInterface.lorefkey, "productid":productid, "qty" : qty, "size" : size }, LiteCartInterface.UpdateCartContent);
}

LiteCartInterface.RemoveLiteOrderItem = function(refkey){
	$.post(LiteCartInterface.req_interface_URL, { action: "Remove", "lorefkey":LiteCartInterface.lorefkey,  "refkey":refkey }, LiteCartInterface.UpdateCartContent);
}

LiteCartInterface.SetQuantity = function(refkey, value){
	$.post(LiteCartInterface.req_interface_URL, { action: "SetQuantity", "lorefkey":LiteCartInterface.lorefkey, "refkey":refkey, "value":value }, LiteCartInterface.UpdateCartContent);
}

/* FEEDBACK  */
LiteCartInterface.UpdateCartContent = function(jsonstring){
	try{ 
		var data = $.parseJSON(jsonstring);
		
		if(data.success){
			if(data.notificationmessage){
				$("#productFeedback").html(data.notificationmessage);
				setTimeout(function(){$("#productFeedback").removeClass("error").addClass("success").fadeIn()}, 200);
				setTimeout(function(){$("#productFeedback").fadeOut("fast",function(){$(this).html("");})}, 5000);
			}
		
			if(data.itemcount > 1) $("#cartItemCount").html( data.itemcount + " items");
			else if(data.itemcount == 1) $("#cartItemCount").html( data.itemcount + " item");
			else $("#cartItemCount").html("0 items");
			
			//$("#cartItemCount").effect("highlight", {}, 175);
		}
		else{
			if(data.notificationmessage){
				$("#productFeedback").html(data.notificationmessage);
				setTimeout(function(){$("#productFeedback").removeClass("success").addClass("error").fadeIn()}, 200);
				setTimeout(function(){$("#productFeedback").fadeOut("fast",function(){$(this).html("");})}, 5000);
			}
		}

		//reset form values
		$(".amountInput").val("0");
		$("#sizes span.size").removeClass("active");
	}catch(e){}
}