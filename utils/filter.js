const filterOptions = {
  'key1': 'value1',
  'key2': 'value2',
  'key3': 'value3'
};

function filterName(key){
  return filterOptions[key]
}

export default {
  filterName
}
