
node -> original node
proxy(node) -> proxified node (le coeur de la runtime)

nodes [ O ]
    a set of functions 
    f(in payload): out payload

edges (direct) [ <--> ]
    connect the ouput of a function to the input of a function
    f():payload => edge(payload) => f(payload)


O<-->O<-->O
     

Runtimes :
    with mediator(shared) :
        pro :   
            - global registry
            - simpler edge création, no reference to system needed
        cons :
            - impact performance 
            - shared
    with local registry :
        pro : 
            - no impact on performance (outside debug)
            - local to system
        cons :
            - no global registre 
            - need to get reference for the destination system


