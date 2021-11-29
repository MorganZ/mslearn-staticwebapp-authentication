import { createApp } from 'vue'
import routes from './routes';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router'
import './index.css';

let router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app')

// import { EdgeDefinition, EdgeDefinitionWithTranforms, PlanDefinition } from './engine/Types';
// import Runtime from './engine/Runtime';
// import TestSystem from './engine/systems/testSystem';



// const plan1 = function () {
//     var nodes = {
//         //participation: new Particiation(),
//         test: new TestSystem(),
//         test2: new TestSystem()
//     };
//     var edges = function (n = nodes) {
//         return [
//            // new EdgeDefinitionWithTranforms(n.participation.pay, () => "ahah", n.test.test)
//         ]
//     }
//     return { nodes, edges }
// }

// const r = new Runtime();
// const plan = plan1();
// var p = r.track(plan as unknown as PlanDefinition);

// plan.nodes.participation.pay({userId:"2", participation:3, card:"qsdfqsdf"})

// let result = 0;

// let nvalue = 600851475143;

// function isPrime(n){
//     for(let i=2; i<n;i++){
//         if(n%i==0)
//             return false
//     }
//     return true
// }

// for(let i=nvalue-1; i>2; i--){
//     if(isPrime(i)){
//         if(nvalue%i==0){
//             console.log(i);
//         }
//     }
// }


// console.log( result)
