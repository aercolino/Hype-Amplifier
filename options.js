/**
 * Hype-Amplifier, Andrea Ercolino, http://noteslog.com
 */

jQuery(function ($) 
{    
    function save_options()
    {
        localStorage['points_weight'] = $('#slider').slider('value');
        
        $('#status').fadeIn(500, function () {
        	$(this).fadeOut(1500);
        });
    }
    
    function restore_options()
    {
        var points_weight = localStorage['points_weight'];
        $('#slider').slider('value', points_weight);
        show_value(points_weight);
    }
    
    function show_value( value )
    {
    	$( '#points_weight' ).text( value );
        $( '#comments_weight' ).text( 100 - value );
    }
    

    $('#slider').slider({
    	slide: function( event, ui ) 
    	{
    		show_value(ui.value);
        }
    });
    restore_options();
    $('#save').click(save_options);
});
