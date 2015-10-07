$(document).ready(function(){

  var apiurl = 'http://vb.api.stager.zoocha.com/market-selector/results';

  var postcode = '',
      areaCode = '',
      businessType = '',
      localArea = [''],
      existingMarkets = [''],
      chinaWelcome = '';
 

  $('.js-location-type').change(function() {
    var locationFilter = $(this).val();

    $('.js-location-input').addClass('hidden');
    
    postcode = '';
    $('.js-postcode').val('');
    areaCode = '';
    $('.js-area-code').val('');

    if (locationFilter != '') {
      $('.' + locationFilter).removeClass('hidden');
    }
  console.log(postcode, areaCode, businessType, localArea, existingMarkets, chinaWelcome);
  marketAPICall();
  });

  $('.js-postcode').change(function() {
    postcode = $(this).val();
    areaCode = '';
  console.log(postcode, areaCode, businessType, localArea, existingMarkets, chinaWelcome);
  marketAPICall();
  });

  $('.js-area-code').change(function() {
    postcode = '';
    $('.js-postcode').val('');
    areaCode = $(this).val();
  console.log(postcode, areaCode, businessType, localArea, existingMarkets, chinaWelcome);
  marketAPICall();
  });

  $('.js-business-type').change(function() {

    var businessTypeCheck = $(this).val();

    $('.js-business-input').addClass('hidden');
    $('.js-business-input').val('');
    switch (businessTypeCheck) {
      case '':
        businessType = '';
        break;
      case 'Retailer':
      case 'Tour operator/DMC':
        businessType = businessTypeCheck;
        break;
      default:
        businessType = '';
        $('.' + businessTypeCheck).removeClass('hidden');  
    }
  console.log(postcode, areaCode, businessType, localArea, existingMarkets, chinaWelcome);
  marketAPICall();
  });

  $('.js-business-input').change(function(){
    businessType = $(this).val();
  console.log(postcode, areaCode, businessType, localArea, existingMarkets, chinaWelcome);
  marketAPICall();
  });

  $('.js-local-area-input').change(function(){
    
    localArea = $(this).val();

    if (localArea === null) {
      localArea = [''];
    }
  console.log(postcode, areaCode, businessType, localArea, existingMarkets, chinaWelcome);
  marketAPICall();
  });

  $('.js-existing-markets-input').change(function(){
    existingMarkets = $(this).val();
    if (existingMarkets === null) {
      existingMarkets = [''];
      marketAPICall();
    } else if (existingMarkets.indexOf('China') != -1) {
      $('.js-china-block').removeClass('hidden');
    } else {
      $('.js-china-block').addClass('hidden');
      $('.js-china-link').addClass('hidden');
      chinaWelcome = '';
      $('.js-china-input').attr('checked', false);
      marketAPICall();
    }
    console.log(postcode, areaCode, businessType, localArea, existingMarkets, chinaWelcome);
    
  });

  $('.js-china-input').change(function(){
    chinaWelcome = $(this).val();
    switch (chinaWelcome) {
      case 'yes':
        $('.js-china-link').addClass('hidden');
        marketAPICall();
        break;
      case 'no':
        $('.js-china-link').removeClass('hidden');
        break;
    }
    console.log(postcode, areaCode, businessType, localArea, existingMarkets, chinaWelcome);
  });

  function marketAPICall () {

    $('.js-results-block').addClass('hidden');
    $('.js-error-block').addClass('hidden');
    $('.js-loading-block').removeClass('hidden');

    // Set data object
    var data = {
      'url': apiurl,
      'postcode': postcode,
      'area_code': areaCode,
      'business_type': businessType,
      'local_area': localArea,
      'existing_markets': existingMarkets
    };

    // Make Ajax Call
    $.ajax ({
      
      url: '/market-selector/marketProxy.php',
      method: 'post',
      data: data

    }).done(function(response) {
      console.log(response);

      var responseJSON = JSON.parse(response);
      
      if ('error' in responseJSON) {

        var error = responseJSON['error']['message'];
        $('.js-loading-block').addClass('hidden');
        $('.js-error-block').removeClass('hidden');
        $('.js-error').html(error);

      } else {

        var markets = responseJSON['suggested_markets'];

        for(entry in markets) {
          
          var result = markets[entry]['market'];
          var spend = (parseFloat(markets[entry]['spend'])/1000000000).toFixed(2);
          var linkReferance = result.toLowerCase();
          var linkReferance = linkReferance.replace(' ', '-')
          var imagePath = '';
          switch (result) {
            case 'Czech Republic':
              imagePath = 'Chez-Republic';
              break;
            case 'Hong Kong':
              imagePath = 'Hongkong';
              break;
            case 'Ireland':
              imagePath = 'Irish-Flag';
              break;
            case 'New Zeland':
              imagePath = 'New-Zeland';
              break;
            case 'Saudi Arabia':
              imagePath = 'Saudi-Arabia';
              break;
            case 'South Africa':
              imagePath = 'South-Africa';
              break;
            case 'South Korea':
              imagePath = 'South-Korea';
              break;
            case 'Brazil':
              imagePath = 'brazil';
              break;
            case 'Malaysia':
              imagePath = 'malaysia';
              break;
            default:
              imagePath = result;
          }

          $('.js-image-' + entry).attr('src', '/sites/default/files/vb-corporate/Images/markets/' + imagePath + '.png')
          $('.js-result-' + entry).html(result);
          $('.js-spend-' + entry).html('&pound; ' + spend + ' bn');
          $('.js-link-' + entry).attr('href', '/markets/' + linkReferance);
        }
        
        $('.js-loading-block').addClass('hidden');
        $('.js-results-block').removeClass('hidden');

      }
    });
  };

});