(function($) {
    $.fn.cityMultiple = function() {

        var self = this;
        var html = '<div id="cyy-cityMultiple">' + '<div id="cyy-cities">' + '<div class="cyy-title">省/市</div>' + '<div id="cyy-cities-list">' + '<ul>';
        var j = 0;
        for (city in getCityData()) {
            html += '   <li class="city-item"><input class="city-checkbox"  type="checkbox"   id="cyy-city-' + j + '"  data-city="' + city + '"><label  class="city-label" for="cyy-city-' + j + '">' + city + '</label>';
            if (getCityData()[city].length > 0) {
                html += '<ul class="cyy-items">';
                for (var i = 0; i < getCityData()[city].length; i++) {
                    html += ' <li><input type="checkbox" class="city-s" id="cyy-city-' + j + '-' + i + '" data-city="' + city + '" data-city-s="' + getCityData()[city][i] + '"><label for="cyy-city-' + j + '-' + i + '">' + getCityData()[city][i] + '</label></li>'
                }
                html += '</ul>';
            }
            html += ' </li>';
            j++;
        }
        html += '</ul></div></div><div id="cyy-selected">';
        html += '<div class="cyy-title">已选择地区 <a href="javascript:;" class="cyy-city-delete" id="cyy-allDelete" title="全部删除">&times;</a></div>';
        html += '<div id="cyy-selected-list"> <ul></ul></div>';
        html += '<div>';
        html = $(html);
        self.html(html);

        html.find(".city-item .city-checkbox").click(function(event) {
            event.stopPropagation();
            var cityItem = $(this).parent().find('ul input');
            if ($(this).prop("checked")) {
                cityItem.prop("checked", true);
            } else {
                cityItem.prop("checked", false);
            }
            setSelectCity(getSelectedCity());
        });
        html.find(".cyy-items .city-s").click(function(event){event.stopPropagation();});
        html.find(".cyy-items .city-s").change(function() {
            var parentCity = $(this).parents(".city-item").children('input');
            var checkedNum = $(this).parents(".city-item").find('.city-s:checked');
            if (checkedNum.length > 0) {
                parentCity.prop("checked", true);
            } else {
                parentCity.prop("checked", false);
            }
            setSelectCity(getSelectedCity());
        });
        html.find(".city-item").mouseover(function() {
            $(this).parent().find('ul').hide();
            $(this).find('ul').show();
        });
        html.find(".city-item ul").mouseout(function() {
            $(this).hide();
        });

        html.delegate('.city-switch', 'click', function(event) {
            var parentLi = $(this).parent();
            if (parentLi.hasClass("cyy-flod-close")) {
                parentLi.removeClass("cyy-flod-close");
                parentLi.addClass("cyy-flod-open'");
                $(this).html("&or;");
            } else {
                parentLi.removeClass("cyy-flod-open");
                parentLi.addClass("cyy-flod-close");
                $(this).html("&gt;");
            }
        });
        /*删除选择的城市*/
        html.delegate('.city-delete', 'click', function(event) {
            var parentLi = $(this).parent();
            var city = $(this).attr("city-data").split("_");
            var checked1 = html.find('input[data-city=' + city[0] + ']');
            var checked2 = html.find('input[data-city-s=' + city[1] + ']');
            var elNum = parentLi.siblings().length;
            if (city[1] === undefined) {
                checked1.prop('checked', false);
            } else {
                checked2.prop('checked', false);
            }
            if (elNum === 0) {
                checked1.prop('checked', false);
                parentLi.parents(".cyy-flod").remove();
            }
            parentLi.remove();
        });
        html.find("#cyy-allDelete").click(function() {
            $("#cyy-selected-list>ul").html("");
            html.find("input").prop('checked', false);
        });
        /*将数组转换为对象*/
        function arrayToObj(cities) {
            var citiesObj = {};
            for (var i = 0; i < cities.length; i++) {
                var city = cities[i].split(" ");
                if (citiesObj[city[0]] === undefined) {
                    citiesObj[city[0]] = [];
                }
                citiesObj[city[0]].push(city[1]);
            }
            return citiesObj;
        }

        /*设置选择的城市*/
        function setSelectCity(citiesObj) {
            html.find("#cyy-selected-list>ul").html("");
            for (cityName in citiesObj) {
                var selectedItem = "";
                if (citiesObj[cityName].length === getCityData()[cityName].length) {
                    selectedItem = '<li   class="cyy-flod cyy-flod-close"><a href="javascript:;" class="city-switch">&gt;</a><span class="city-s">' + cityName + '</span><a href="javascript:;" city-data="' + cityName + '" class="cyy-city-delete city-delete " title="删除">&times;</a>';
                    selectedItem += '<ul class="cyy-select">';
                } else {
                    selectedItem = '<li   class="cyy-flod cyy-flod-open"><a href="javascript:;" class="city-switch">&or;</a><span class="city-s">' + cityName + '</span><a href="javascript:;"  city-data="' + cityName + '" class="cyy-city-delete city-delete " title="删除">&times;</a>';
                    selectedItem += '<ul class="cyy-select ">';
                }
                for (var i = 0; i < citiesObj[cityName].length; i++) {
                    selectedItem += '<li data-city-s="' + citiesObj[cityName][i] + '"><span>' + citiesObj[cityName][i] + '</span><a href="javascript:;"  city-data="' + cityName + "_" + citiesObj[cityName][i] + '" class="cyy-city-delete city-delete" title="删除">&times;</a></li>';
                }
                selectedItem += '</ul></li>';
                html.find("#cyy-selected-list>ul").append(selectedItem);
            }
        }

        /*获取已选择城市数组*/
        function getSelectedCityArray() {
            var cities = [];
            for (cityName in getSelectedCity()) {
                var citys = getSelectedCity()[cityName];
                for (var i = 0; i < citys.length; i++) {
                    cities.push(cityName + " " + citys[i]);
                }
            }
            return cities;
        }
        /*获取已选择城市对象*/
        function getSelectedCity() {
            var selectedCity = {};
            html.find(".city-item").each(function(index, val) {
                var selectedCheckbox = $(this).children('input');
                if (selectedCheckbox.prop('checked')) {
                    var selectedCItyS = $(this).find('ul input:checked');
                    var pCity = selectedCheckbox.attr("data-city");
                    if (selectedCity[pCity] === undefined) {
                        selectedCity[pCity] = [];
                    }
                    selectedCItyS.each(function(index, city) {
                        selectedCity[pCity].push($(this).attr("data-city-s"));
                    });
                }
            });
            return selectedCity;
        }

        function setInit(citiesArray) {
            for (var i = citiesArray.length - 1; i >= 0; i--) {
                var city = citiesArray[i].split(" ");
                var checked1 = html.find('.city-checkbox[data-city=' + city[0] + ']');
                checked1.prop('checked', true);
                var checked2 = html.find('input[data-city-s=' + city[1] + ']');
                checked2.prop('checked', true);
            }

            setSelectCity(arrayToObj(citiesArray));
        }

        function getCityData() {
            var cities = {};
            cities['北京市'] = ['昌平区', '朝阳区', '崇文区', '大兴区', '东城区', '房山区', '丰台区', '海淀区', '怀柔区', '门头沟区', '密云县', '平谷区', '石景山区', '顺义区', '通州区', '西城区', '宣武区', '延庆县'];
            cities['上海市'] = ['宝山区', '崇明县', '奉贤区', '虹口区', '黄浦区', '嘉定区', '金山区', '静安区', '卢湾区', '闵行区', '浦东新区', '普陀区', '青浦区', '松江区', '徐汇区', '杨浦区', '闸北区'];
            cities['天津市'] = ['宝坻区', '北辰区', '东丽区', '河北区', '河东区', '和平区', '河西区', '红桥区', '蓟县', '津南区', '静海县', '南开区', '宁河县', '武清区', '西青区', '滨海新区'];
            cities['重庆市'] = ['巴南区', '北碚区', '璧山县', '城口县', '大渡口区', '大足县', '垫江县', '丰都县', '奉节县', '涪陵区', '合川区', '江北区', '江津区', '九龙坡区', '开县', '梁平县', '南岸区', '南川区', '彭水县', '綦江县', '黔江区', '荣昌县', '沙坪坝区', '石柱县', '双桥区', '铜梁县', '潼南县', '万盛区', '万州区', '巫山县', '巫溪县', '武隆县', '秀山县', '永川区', '酉阳县', '渝北区', '渝中区', '云阳县', '长寿区', '忠县'];
            cities['澳门'] = [];
            cities['香港'] = [];
            cities['台湾省'] = [];
            cities['安徽省'] = ['安庆市', ' 蚌埠市', ' 亳州市', '巢湖市', '池州市', '滁州市', '阜阳市', '合肥市', '淮北市', '淮南市', '黄山市', '六安市', '马鞍山市', '铜陵市', '芜湖市', '宿州市', '宣城市'];
            cities['福建省'] = ['福州市', '龙岩市', '南平市', '宁德市', '莆田市', '泉州市', '三明市', '厦门市', '漳州市'];
            cities['甘肃省'] = ['白银市', '定西市', '嘉峪关市', '金昌市', '酒泉市', '兰州市', '临夏回族自治州', '陇南市', '平凉市', '庆阳市', '天水市', '武威市', '张掖市', '甘南市'];
            cities['广东省'] = ['潮州市', '东莞市', '佛山市', '广州市', '河源市', '惠州市', '江门市', '揭阳市', '茂名市', '梅州市', '清远市', '汕头市', '汕尾市', '韶关市', '深圳市', '阳江市', '云浮市', '湛江市', '肇庆市', '中山市', '珠海市'];
            cities['广西省'] = ['百色市', '北海市', '防城港市', '贵港市', '桂林市', '河池市', '贺州市', '来宾市', '柳州市', '南宁市', '钦州市', '梧州市', '玉林市', '崇左市'];
            cities['贵州省'] = ['安顺市', '毕节市', '贵阳市', '六盘水市', '黔东南苗族侗族自治州', '黔南布依族苗族自治州', '黔西南布依族苗族自治州', '铜仁市'];
            cities['海南省'] = ['儋州市', '东方市', '海口市', '琼海市', '三亚市', '文昌市', '五指山', '万宁'];
            cities['河北省'] = ['保定市', '沧州市', '承德市', '邯郸市', '衡水市', '廊坊市', '秦皇岛市', '石家庄市', '唐山市', '邢台市', '张家口市'];
            cities['河南省'] = ['安阳市', '鹤壁市', '焦作市', '开封市', '漯河市', '洛阳市', '南阳市', '平顶山市', '濮阳市', '三门峡市', '商丘市', '新乡市', '信阳市', '许昌市', '郑州市', '周口市', '驻马店市', '济源市'];
            cities['黑龙江省'] = ['大庆市', '大兴安岭地区', '哈尔滨市', '鹤岗市', '黑河市', '鸡西市', '佳木斯市', '牡丹江市', '七台河市', '齐齐哈尔市', '双鸭山市', '绥化市', '伊春市'];
            cities['湖北省'] = ['鄂州市', '恩施市', '黄冈市', '黄石市', '荆门市', '荆州市', '潜江市', '神农架林区', '十堰市', '随州市', '天门市', '武汉', '仙桃市', '咸宁市', '襄樊市', '孝感市', '宜昌市'];
            cities['湖南省'] = ['常德市', '郴州市', '衡阳市', '怀化市', '娄底市', '邵阳市', '湘潭市', '湘西土家族苗族自治州', '益阳市', '永州市', '岳阳市', '张家界市', '长沙市', '株洲市'];
            cities['吉林省'] = ['白城市', '白山市', '吉林市', '辽源市', '四平市', '松原市', '通化市', '延边朝鲜族自治州', '长春市'];
            cities['江苏省'] = ['常州市', '淮安市', '连云港市', '南京市', '南通市', '苏州市', '泰州市', '无锡市', '宿迁市', '徐州市', '盐城市', '扬州市', '镇江市'];
            cities['江西省'] = ['抚州市', '赣州市', '吉安市', '景德镇市', '九江市', '南昌市', '萍乡市', '上饶市', '新余市', '宜春市', '鹰潭市'];
            cities['辽宁省'] = ['鞍山市', '本溪市', '朝阳市', '大连市', '丹东市', '抚顺市', '阜新市', '葫芦岛市', '锦州市', '辽阳市', '盘锦市', '沈阳市', '铁岭市', '营口市'];
            cities['内蒙古省'] = ['阿拉善盟', '巴彦淖尔市', '包头市', '赤峰市', '鄂尔多斯市', '呼和浩特市', '呼伦贝尔市', '通辽市', '乌海市', '乌兰察布市', '锡林郭勒盟', '兴安盟'];
            cities['宁夏省'] = ['固原市', '石嘴山市', '吴忠市', '银川市', '中卫市'];
            cities['青海省'] = ['海东地区', '海西蒙古族藏族自治州', '西宁市', '玉树藏族自治州', '海南藏族自治州'];
            cities['山东省'] = ['滨州市', '德州市', '东营市', '菏泽市', '济南市', '济宁市', '莱芜市', '聊城市', '临沂市', '青岛市', '日照市', '泰安市', '威海市', '潍坊市', '烟台市', '枣庄市', '淄博市'];
            cities['山西省'] = ['大同市', '晋城市', '晋中市', '临汾市', '吕梁市', '朔州市', '太原市', '忻州市', '阳泉市', '运城市', '长治市'];
            cities['陕西省'] = ['安康市', '宝鸡市', '汉中市', '商洛市', '铜川市', '渭南市', '西安市', '咸阳市', '延安市', '榆林市'];
            cities['四川省'] = ['阿坝藏族羌族自治州', '巴中市', '成都市', '达州市', '德阳市', '甘孜藏族自治州', '广安市', '广元市', '乐山市', '凉山彝族自治州', '泸州市', '眉山市', '绵阳市', '南充市', '内江市', '攀枝花市', '遂宁市', '雅安市', '宜宾市', '资阳市', '自贡市'];
            cities['西藏省'] = ['拉萨市', '林芝地区', '那曲地区', '日喀则地区', '昌都市'];
            cities['新疆省'] = ['阿克苏地区', '阿勒泰市', '巴音郭楞蒙古自治州', '博尔塔拉蒙古自治州', '昌吉回族自治州', '哈密市', '和田市', '喀什市', '克拉玛依市', '石河子市', '塔城市', '吐鲁番市', '乌鲁木齐市', '伊犁市', '克孜勒苏柯尔克孜', '五家渠'];
            cities['云南省'] = ['保山市', '楚雄市', '大理市', '德宏傣族景颇族自治州', '红河哈尼族彝族自治州', '昆明市', '丽江市', '临沧市', '普洱市', '曲靖市', '文山市', '玉溪市', '昭通市', '怒江傈僳族自治州', '迪庆藏族自治州', '西双版纳傣族自治州'];
            cities['浙江省'] = ['杭州市', '湖州市', '嘉兴市', '金华市', '丽水市', '宁波市', '衢州市', '绍兴市', '台州市', '温州市', '舟山市'];
            return cities;
        }

        return {
            get: function() {
                return getSelectedCityArray();
            },
            set: setInit
        }
    }
})(jQuery);
