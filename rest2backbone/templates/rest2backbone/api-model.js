api.{{m.name}} = RestBaseModel.extend({
	urlRoot:'{{m.url}}',
	fields: {{m.fields_json}},
	modelName: "{{m.name}}"
});