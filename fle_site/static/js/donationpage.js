
//Donation Interface  
$(function() {
  var btn_card = $('#btn-card');
  var btn_paypal = $('#btn-paypal')
  var input_field = $('#InputAmount');



  //"Other"input field slides down
  $("#other-amount").click(function() {
    $("#input-amount").slideDown();

    var amount;
    amount = input_field.val();

    input_field.focus(); //cursor goes to text-field

    //Setting payment buttons to disable 
    // if (amount.length == 0 ){
    //   btn_card.prop('disabled',true);
    //   btn_paypal.prop('disabled',true);
    // }

    input_field.keyup(function(){
      if ($(this).val().length != 0 && $(this).val().match(/(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/)){
        btn_card.prop('disabled',false);
        btn_paypal.prop('disabled',false);
        $('.alert-text').hide();
      }else{
        btn_card.prop('disabled',true);
        btn_paypal.prop('disabled',true);
        $('.alert-text').show();
      }
    });
  });

  //Click of donation-amount buttons toggle button-pressed effect
  $(".btn-amount").click(function(){
   $(this).toggleClass('active').siblings().removeClass("active");
  });

  //Click stores value of preset $20, $50, $100 is stored 
  $(".btn-amount-number").click(function(){
   var amount = $(this).attr("value");
   console.log(amount);
  });

  //Hides the other input box when $20, $50, $100 is selected
  $(".btn-amount-number").click(function(){
    $("#input-amount").slideUp();
    $('.alert-text').hide();
    btn_card.prop('disabled',false);
    btn_paypal.prop('disabled',false);
  });

});









//Stripe  
$(function(){ 

  var MonthlyGiving = false;
  var btn_card = $('#btn-card');
  var input_field = $('#InputAmount');
  
  //Stripe Integration
  var handler = StripeCheckout.configure({
    key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
    image: 'https://s3.amazonaws.com/stripe-uploads/acct_102ejd27dVLKpIVBmerchant-icon-141490-FLE-globe-only-logo.png' ,
    locale: 'auto',
    token: function(data) {

              $.ajax({
                  method: "POST",
                  url: "/donate/process/",
                  data: JSON.stringify(data),
                  dataType: "json",
                  contentType: "application/json",
                  beforeSend: function(xhr, settings) {
                      xhr.setRequestHeader("X-CSRFToken", data.csrfmiddlewaretoken);
                  }
              }).then(function(response) {
                  show_message(response.status, response.message, "transaction-message");
              });
        }
  });



  //'Pay by Card' is clicked
  btn_card.on('click', function(e) {

    //Check for monthly giving
    if (  $('#monthly-checkbox').prop('checked') ){
      MonthlyGiving = true;
      console.log('Monthy Giving');  //Check if monthly payment is selected
    }
    
    if (  $(".active").val() == "custom"){
      amount = $("#InputAmount").val();
      if (amount.length != 0 && amount.match(/(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/) && amount != 0){
        console.log(amount);
        console.log(MonthlyGiving);

        handler.open({
        name: 'Learning Equality',
        description: 'Donation',
        amount: amount*100,
        panelLabel: "Give",
        });
        e.preventDefault();
      }else{
        $('.alert-text').show();
      }  
    }else{
      amount = $(".active").val();
      
      console.log(amount);
      console.log(MonthlyGiving);

      handler.open({
      name: 'Learning Equality',
      description: 'Donation',
      amount: amount*100,
      panelLabel: "Give",
      });
      e.preventDefault();
    } 
  });

  //Keyboard "enter" button is used for text-field input
  input_field.keypress(function(e){
      if (e.which == 13){
        btn_card.click();
      }
  });

  // Close Checkout on page navigation
  $(window).on('popstate', function() {
    handler.close();
  });
});



//Paypal Integration
$(function(){ 

  $('#btn-paypal').click(function(){

    $('button[data-loading-text]')
    .on('click', function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
            btn.button('reset')
        }, 3000)
    });

   $.fn.monthlyGiving = function(){
    if ( $('#monthly-checkbox').prop('checked') ){
      $('input:hidden[name=a3]').val(amount);
      $('#paypal_monthly').submit();
      $('.loader').show();
      $(this).css('background-color','#48ABD9')
    }else{
      $('input:hidden[name=amount]').val(amount);
      $('#paypal_once').submit();
      $('.loader').show();
      $(this).css('background-color','#48ABD9'); 
    }
    console.log('monthlygiving func')
   };

//Check for monthly giving
    if (  $(".active").val() == "custom"){
     var amount = $("#InputAmount").val();
      if (amount.length != 0 && amount.match(/(?=.)^\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)?(\.[0-9]{1,2})?$/) && amount != 0){
        
        $(this).monthlyGiving();
        
      }else{
        $('.alert-text').show();
      }  
    }else{
      amount = $(".active").val();
      $(this).monthlyGiving();
    } 
   });
});




$(function(){ 
  var times = 0;
  
  $('.guarantee').waypoint(function(direction){ 

    if (direction === 'down' && times == 0){

    var bar = new ProgressBar.Circle('#circle-stats', {
      color: '#FFFFFF',
      // This has to be the same size as the maximum width to
      // prevent clipping
      strokeWidth: 4,
      trailWidth: 0,
      easing: 'easeInOut',
      duration: 1400,
      text: {
        autoStyleContainer: false
      },
      from: { color: '#FFFFFF', width: 0 },
      to: { color: '#FFFFFF', width: 4 },
      // Set default step function for all animate calls
      step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = Math.round(circle.value() * 100);
        if (value === 0) {
          circle.setText('');
        } else {
          circle.setText(value + "<html>% <br> Guarantee</html>" );
        }
      }
    });

    bar.text.style.position = 'relative';
    bar.text.style.top = '-129px';

    bar.animate(1.0);  // Number from 0.0 to 1.0
    }

    times =+ 1;
  }, {
    offset: '60%' 
  })
});
 
  
