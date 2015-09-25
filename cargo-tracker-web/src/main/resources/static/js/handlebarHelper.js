
Handlebars.registerHelper('table-head', function () {
    var th = '<th style="width:'+this.width+'" class="'+(this.hidden == true ? 'hide' : '')+'">'+this.display+'</th>';
    return th;
});

Handlebars.registerHelper('entry-form-center', function(){
	var fieldHtml = "";
	if(this.viewonly){
		fieldHtml = '<label class="form-input-to-label">'+this.value+'</label>';
	}else{
		fieldHtml = (this.type === 'select')?'<select ' : '<input type="'+this.type+'" ';
		fieldHtml += 'id="'+this.id+'" ';
		fieldHtml +=' name="'+this.name+'" ';
		fieldHtml +=(this.value)?' value="'+this.value+'" ': '';
		fieldHtml +=(this.size)?' size="'+this.size+'" ' : '';
		fieldHtml +=(this.min)?' min="'+this.min+'" ' : '';
		fieldHtml +=(this.maxlength)?' maxlength="'+this.maxlength+'" ' : '';
		fieldHtml +=(this.placeholder)?' placeholder="'+this.placeholder+'" ' : '';
		fieldHtml +=(this.required)?' '+(this.required?'required':' ') : '';
		fieldHtml +=(this.disabled)?' '+(this.disabled?'disabled':' ') : '';
		fieldHtml +=(this.type === 'select')?' ></select>' : ' />';
	}
	
	var row = '<div class="row entry-row">'
		+'<div class="small-12">'
		+ '<div class="row">'
		+  '<div class="small-4 columns">'
		+   '<label for="'+this.name+'" class="inline right">'+this.displayName+'</label>'
		+  '</div>'
		+  '<div class="small-5 left columns">'
		+   fieldHtml
		+  '</div>'
		+ '</div>'
		+'</div>'
		+'</div>';
	return row;
});