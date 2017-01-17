auth.controller('ApplicationController', ['$scope', '$location', '$state', 'applicationService', function($scope, $location, $state, applicationService) {
	$scope.applicationList = [];
	$scope.params = {
		startNum: $scope.applicationList.length,
		endNum: $scope.applicationList.length+10
	};

	$scope.create = function(){
	  $state.go("application.create");
	};

	$scope.getList = function(params){
		applicationService.getList(params)
			.then(function(data){
				// $scope.applicationList = data;
				$scope.applicationList = [
					{
						"id":100,
						"name":"p1",
						"desc":"p1",
						"applicationNum":5,
						"moduleNum":8
					},
					{
						"id":101,
						"name":"p2",
						"desc":"p2",
						"applicationNum":7,
						"moduleNum":10
					}
				]
			}, function(err){
				console.log('获取application list err:',err);
				$scope.applicationList = [
					{
						"id":100,
						"name":"p1",
						"desc":"p1",
						"applicationNum":5,
						"moduleNum":8
					},
					{
						"id":101,
						"name":"p2",
						"desc":"p2",
						"applicationNum":7,
						"moduleNum":10
					}
				]
			});	
	};

	$scope.edit = function(item){
		$state.go('project.edit',{id:item.id,name:item.name})
	};

	$scope.getList($scope.params);

}])

.controller('ApplicationCreateController', ['$scope', '$location','$state', '$stateParams', 'applicationService', function($scope, $location, $state, $stateParams, applicationService) {
  $scope.currentStep = 'baseInfo';
  $scope.action = 'Create';
  $scope.baseInfo = {
		name: '',
		desc: '',
		visible: 'public',
		id: '-1'
	};
	$scope.projectList = [];
	$scope.teamList = [];
	$scope.chooseTeams = [];
	$scope.roleTeams = [];
	$scope.isShowOrgs = false;
	$scope.currentOrg = {
		name: '',
		id: ''
	};

	$scope.changeStep = function(val){
		$scope.currentStep = val;
	}

	$scope.saveBaseInfo = function(){
		var params = {
			name: $scope.baseInfo.name,
			desc: $scope.baseInfo.desc,
			id: $scope.baseInfo.id
		};
		if(params.name){
			applicationService.saveBaseInfo(params)
				.then(function(data){
					$scope.baseInfo.id = data.id;
					console.log('保存成功')
				},function(err){
					console.log('保存失败：',err)
				})
		}else{
			console.log('请填写用户名')
		}
	}

	$scope.saveSetting = function(){
		if($scope.baseInfo.id!=='-1'){
			var params = $scope.chooseTeams;
			if(params.name){
				applicationService.saveSetting(params)
					.then(function(data){
						console.log('保存成功')
					},function(err){
						console.log('保存失败：',err)
					})
			}else{
				console.log('请填写用户名')
			}
		}else{
			console.log('请先创建一个application')
		}
	};

	// get project list
	$scope.getProjectList = function(params){
		applicationService.getProjectList(params)
			.then(function(data){
				// $scope.projectList = data;
				$scope.projectList = [
					{
						"id":100,
						"name":"org1"
					},
					{
						"id":101,
						"name":"org2"
					},
					{
						"id":102,
						"name":"org3"
					}
				]
				$scope.currentOrg = $scope.projectList[0];
			},function(err){
				console.log('获取组织列表失败:',err);
				$scope.projectList = [
					{
						"id":100,
						"name":"project1"
					},
					{
						"id":101,
						"name":"project2"
					},
					{
						"id":102,
						"name":"project3"
					}
				]
				$scope.currentOrg = $scope.projectList[0];
			})
	};

	// get team list
	$scope.getTeamList = function(params){
		applicationService.getTeamList(params)
			.then(function(data){
				// $scope.teamList = data;
				$scope.teamList = [
					{
						"id":100,
						"name":"team1",
						"isChosed": false
					},
					{
						"id":101,
						"name":"team2",
						"isChosed": false
					},
					{
						"id":102,
						"name":"team3",
						"isChosed": false
					}
				]
			},function(err){
				console.log('获取team list失败:',err);
				$scope.teamList = [
					{
						"id":100,
						"name":"team1",
						"isChosed": false
					},
					{
						"id":101,
						"name":"team2",
						"isChosed": false
					},
					{
						"id":102,
						"name":"team3",
						"isChosed": false
					}
				]
			})
	};

	// get current org to filter team list
	$scope.getCurrentOrg = function(item){
		$scope.currentOrg = item;
		$scope.chooseTeams = [];
		$scope.getTeamList($scope.currentOrg);
		$scope.isShow('isShowOrgs',false);
	}

	$scope.choseTeam = function(item){
		angular.forEach($scope.teamList,function(obj,i){
			if(item.id === obj.id){
				obj.isChosed = !obj.isChosed
			}
		})
		$scope.getChosedTeams($scope.teamList)
	}

	$scope.getChosedTeams = function(originData){
		$scope.chooseTeams = []
		angular.forEach(originData,function(obj){
			if(obj.isChosed){
				$scope.chooseTeams.push(obj)
			}
		})
	}

	$scope.clearChosedStatus = function(originData){
		angular.forEach(originData,function(obj,i){
			obj.isChosed = false
		})
	}

	$scope.isShow = function(key,val){
		$scope[key] = val;
	}

	$scope.getRole = function(val){
		// console.log($scope.chooseTeams)
		var role = ["Admin","Readonly","ReadWrite"][val];
		var obj = {
			"role": role,
			"teams": $scope.chooseTeams
		}

		// if($scope.roleTeams.length>0){
		// 	angular.forEach($scope.roleTeams,function(itemRole,i){
		// 		if(itemRole.role === role){
		// 			console.log(777)
		// 			$scope.roleTeams.splice(i,1)
		// 			$scope.roleTeams.push(obj)
		// 			return
		// 		}else{
		// 			$scope.roleTeams.push(obj)
		// 			return
		// 		}
		// 	})
		// }else{
		// 	$scope.roleTeams.push(obj)
		// }
		$scope.roleTeams.push(obj)
		$scope.chooseTeams = [];
		$scope.clearChosedStatus($scope.teamList);
	};

	$scope.getEditInfo = function(){
		var id = $stateParams.id;
		if($stateParams.id){
			$scope.action = 'Edit';
  		$scope.baseInfo.id = $stateParams.id;
		}
		if(id){
			applicationService.getEditInfo(id)
				.then(function(data){
					// $scope.baseInfo = data;

					$scope.baseInfo = {
						name: 'tom',
						desc: 'this is test',
						visible: 'public'
					};

				},function(err){
					console.log('获取信息失败：',err)
					$scope.baseInfo = {
						name: 'tom',
						desc: 'this is test',
						visible: 'public'
					};
				})
		}
	};

	$scope.getProjectList({user:"small"});
	$scope.getEditInfo();

}]);
