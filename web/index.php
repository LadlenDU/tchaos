<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tiled textures</title>
    <meta name="keywords" content="texture background image random tile online graphic generator application"/>
    <meta name="description" content="Online generator of tiled textures."/>

    <!-- Bootstrap -->
    <link href="/libs/bootstrap-3.3.7-dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <link type="text/css" rel="stylesheet" href="/css/common.css"/>

    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>

</head>

<body>

<div class="container" id="global_wrapper">

    <form class="form-inline save_img_form" action="/save.php" method="POST">
        <input type="hidden" name="image">

        <div class="head_wrap">
            <div class="form-group">
                <label for="width_img_size">Width:&nbsp;</label>
                <input type="text" maxlength="4" name="width" class="form-control" id="width_img_size"
                       placeholder="Width" value="100">
            </div>
            <div class="form-group">
                <label for="height_img_size">Height:&nbsp;</label>
                <input type="text" maxlength="4" name="height" class="form-control" id="height_img_size"
                       placeholder="Height" value="100">
            </div>
            <div class="checkbox">
                <label>
                    <input type="checkbox" name="tile" checked="checked"> Tile
                </label>
            </div>
            <button class="btn btn-default" title="Generate a texture" name="create_btn">Create</button>
            <button type="submit" class="btn btn-default" title="Save the texture" name="save_btn" disabled="disabled">
                Save
            </button>
        </div>
    </form>

    <div class="texture_container_wrapper">
        <div class="texture_container"></div>
    </div>

    <script>
        $(function () {

            var dataUrl;

            var wrapper = $("#global_wrapper");

            wrapper.find(".save_img_form").submit(function () {
                if (dataUrl) {
                    clog(dataUrl);
                    $(this).find("[name=image]").val(dataUrl);
                }
            });

            wrapper.find("[name=create_btn]").click(function () {
                var width = $("#width_img_size").val();
                var height = $("#height_img_size").val();

                var canvas = new Canvas(width, height);

                var props = prepareProperties(render.fill.props);
                render.fill.run(canvas, width, height, props);

                var canvas2 = new Canvas(width, height);
                var clouds = new render.clouds();
                props = prepareProperties(clouds.props);
                clouds.run(canvas, width, height, props);
                //render.figures(canvas2);

                canvas.ctx().globalAlpha = 0.2;
                canvas.ctx().drawImage(canvas2.canvas(), 0, 0);

                dataUrl = canvas.toDataURL();

                /*var rndCol = pic.getRandomColor();

                 var dSurface = new DirectSurface(width, height);
                 for (var y = 0; y < height; ++y) {
                 for (var x = 0; x < width; ++x) {
                 //var col = {r: 0, g: 0, b: 255, a: 255};
                 dSurface.px(x, y, rndCol);
                 }
                 }
                 dSurface.putImageData();*/

                /*var canvas = new Canvas(width, height);
                 var ctx = canvas.ctx();
                 ctx.beginPath();
                 ctx.moveTo(75, 50);
                 ctx.lineTo(200, 75);
                 ctx.lineTo(100, 25);
                 ctx.fill();*/

                /*dSurface.ctx().globalAlpha = 0.2;
                 dSurface.ctx().drawImage(canvas.canvas(), 0, 0);

                 dataUrl = dSurface.toDataURL();*/
                $(".texture_container").css('background-image', "url(" + dataUrl + ")");

                wrapper.find("[name=save_btn]").prop("disabled", false);

                return false;
            });

            wrapper.find("[name=tile]").change(function () {
                $(".texture_container").css("background-repeat", this.checked ? "repeat" : "no-repeat");
            });
        });
    </script>

    <footer class="footer">
        <p class="text-muted">© 2017 Axe-Era</p>
    </footer>

</div>

<!--<script src="js/bootstrap.min.js"></script>-->

<script src="/js/helpers.js"></script>
<script src="/js/core.js"></script>
<script src="/js/render/figures.js"></script>
<script src="/js/render/fill.js"></script>
<script src="/js/render/clouds.js"></script>

</body>
</html>
