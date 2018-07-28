<content>
    <div style={
        "width:900px;height:600px;background-color:#F0F0F0;border:1px;border-style:solid;color:black;font-size:14px;"}>

        <div class="row" style={
            "height:40px;color:#fff;background-color:#015666;font-size:20px;padding-top:5px;margin-right:0px;"}>
            <div class="col-xs-6">
                <div style={ "margin-left:20px;text-align:center;width:700px;"}>
                    {"Hello World"}</div>


            </div>

            <div class="col-xs-4">

            </div>

        </div>


          
        </div>
    </div>

    <script>
        $c.checkAndCreate("$w");
        

        $w.app = this
        $wa = $w.app
        
        $w.app.state = { 

            swal: {
                show: false,
                title: "",
                type: "",
                func: ""
            },
        
        };
        $ws = $w.app.state
 
        this.on('mount', function () {
        })
        this.on('update', function () {
            if ($w.app.state.swal.show) {
                $c.swalshow()
            }

        })
    </script>

    <loginModal>
    
</content>

