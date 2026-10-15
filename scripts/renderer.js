import { Matrix } from './matrix.js';
import * as CG from './transforms.js';

class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;
        //Slide0 Ball
        this.ball_velocity = {x:0.25,y:0.25};
        //Slide3
        this.growing1 = 1;
        this.dist1 = 75;

        this.models = {
            slide0: [ //KRISTINA
                {
                    vertices: [ //center: 400,325 & r=50
                        CG.Vector3(250, 200, 1),
                        CG.Vector3(246.6, 219.1, 1),
                        CG.Vector3(235.4, 235.4, 1),
                        CG.Vector3(219.1, 246.6, 1),
                        CG.Vector3(200, 250, 1),
                        CG.Vector3(180.9, 246.6, 1),
                        CG.Vector3(164.6, 235.4, 1),
                        CG.Vector3(153.4, 219.1, 1),
                        CG.Vector3(150, 200, 1),
                        CG.Vector3(153.4, 180.9, 1),
                        CG.Vector3(164.6, 164.6, 1),
                        CG.Vector3(180.9, 153.4, 1),
                        CG.Vector3(200, 150, 1),
                        CG.Vector3(219.1, 153.4, 1),
                        CG.Vector3(235.4, 164.6, 1),
                        CG.Vector3(246.6, 180.9, 1)
                    ],
                    transform: new Matrix(3,3)
                }
            ],
            slide1: [ //KRISTINA
                { //square
                    vertices: [ //center: 400,325
                        CG.Vector3(400, 550, 1),
                        CG.Vector3(625, 325, 1),
                        CG.Vector3(400, 100, 1),
                        CG.Vector3(175, 325, 1),
                    ],
                    transform: new Matrix(3,3),
                    velocity: -0.0005, //radians per millisec
                    color: [34,107, 113, 255]
                },
                { //Triangle
                    vertices: [ //center: 400,325
                        CG.Vector3(400, 440, 1),
                        CG.Vector3(500, 265, 1),
                        CG.Vector3(300, 265, 1)
                    ],
                    transform: new Matrix(3,3),
                    velocity: 0.001, //radians per millisec
                    color: [214, 135, 24, 255]
                },
                { //Circle thing
                    vertices: [
                        CG.Vector3(500, 325, 1),
                        CG.Vector3(486.6, 375, 1),
                        CG.Vector3(450, 411.6, 1),
                        CG.Vector3(400, 425, 1),
                        CG.Vector3(350, 411.6, 1),
                        CG.Vector3(313.4, 375, 1),
                        CG.Vector3(300, 325, 1),
                        CG.Vector3(313.4, 275, 1),
                        CG.Vector3(350, 238.4, 1),
                        CG.Vector3(400, 225, 1),
                        CG.Vector3(450, 238.4, 1),
                        CG.Vector3(486.6, 275, 1)
                    ],
                    transform: new Matrix(3,3),
                    velocity: -0.001, //radians per millisec
                    color: [86, 24, 24, 255]

                },
                { //Weird diamond star thing
                    vertices: [//center = 400,325, r=25
                        CG.Vector3(400, 350, 1),
                        CG.Vector3(430, 355, 1),
                        CG.Vector3(425, 325, 1),
                        CG.Vector3(430, 295, 1),
                        CG.Vector3(400, 300, 1),
                        CG.Vector3(370, 295, 1),
                        CG.Vector3(375, 325, 1),
                        CG.Vector3(370, 355, 1)
                    ],
                    transform: new Matrix(3,3),
                    velocity: 0.004, //radians per millisec
                    color: [200, 159, 115, 255]
                }
            ],
            slide2: [
                {
                    vertices: [
                        CG.Vector3(175, 175, 1),
                        CG.Vector3(325, 175, 1),
                        CG.Vector3(325, 325, 1),
                        CG.Vector3(175, 325, 1)
                    ],
                    vertices2: [
                        CG.Vector3(475, 200, 1),
                        CG.Vector3(625, 350, 1),
                        CG.Vector3(625, 450, 1),
                        CG.Vector3(475, 300, 1)
                    ]
                }
            ],
            slide3: []
        };
    }

    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) { //KRISTINA
        // TODO: update any transformations needed for animation

        switch (this.slide_idx) { 
            case 0: //Translation & bouncing
                let transform_m = this.models.slide0[0].transform
                if(!transform_m.values){
                    CG.mat3x3Identity(transform_m);
                }

                let transform_x = this.ball_velocity.x * delta_time;
                let transform_y = this.ball_velocity.y * delta_time;

                transform_m.values[0][2] += transform_x;
                transform_m.values[1][2] += transform_y;

                break;

            case 1: //Rotation
                let shapes = this.models.slide1
                for(let polygon of shapes){
                    //find center of polygon to rotate around
                    let [cx, cy] = this.findCenter(polygon.vertices)

                    //find t_angle
                    let t_angle = polygon.velocity * time

                    //Translate to origin
                    let tm0 = new Matrix(3,3)
                    CG.mat3x3Translate(tm0, -cx, -cy)

                    //Rotate around origin
                    let tm1 = new Matrix(3,3)
                    CG.mat3x3Rotate(tm1, t_angle)

                    //Translate back
                    let tm2 = new Matrix(3,3)
                    CG.mat3x3Translate(tm2, cx, cy)

                    //Combine into one transformation
                    polygon.transform = Matrix.multiply([tm2,tm1,tm0])
                }

                break;

            case 2: //Scaling
                this.dist1 += this.growing1 * delta_time * 0.05;
                if(this.dist1 > 150){
                    this.dist1 = 150 - (this.dist1 - 150);
                    this.growing1 = -1;
                    if(this.dist1 < 25){
                        this.dist1 = 25;
                        this.growing1 = 1;
                    }
                }
                else if(this.dist1 < 25){
                    this.dist1 = 25 + (25 - this.dist1);
                    this.growing1 = 1;
                    if(this.dist1 > 150){
                        this.dist1 = 150;
                        this.growing1 = -1;
                    }
                }
                this.models.slide2[0].vertices[0] = CG.Vector3(250-this.dist1, 250-this.dist1, 1);
                this.models.slide2[0].vertices[1] = CG.Vector3(250+this.dist1, 250-this.dist1, 1);
                this.models.slide2[0].vertices[2] = CG.Vector3(250+this.dist1, 250+this.dist1, 1);
                this.models.slide2[0].vertices[3] = CG.Vector3(250-this.dist1, 250+this.dist1, 1);
                break;
            case 3: //All of the above
                break;
        }

    }

    findCenter(vector_list){ // KRISTINA
        //center = avg of x & y for all vertices
        let x=0;
        let y=0;

        for (let v of vector_list) {
            x += v.values[0][0];
            y += v.values[1][0];
        }
        
        x = x/vector_list.length;
        y = y/vector_list.length;

        return [parseInt(x), parseInt(y)]
    }
    
    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() { //KRISTINA
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)
        let new_vertices = []
        let tm = this.models.slide0[0].transform

        for (let v=0;v<this.models.slide0[0].vertices.length;v++){
            //calculate new vertex
            let new_vector = Matrix.multiply([tm,this.models.slide0[0].vertices[v]]);
            new_vertices.push(new_vector);
        }

        //Check hitting wall
        for (let v=0;v<new_vertices.length;v++){
            //calculate new vertex
            this.updateVelocity(new_vertices[v])
        }

        let teal = [0, 128, 128, 255];
        this.drawConvexPolygon(new_vertices, teal);
    }

    updateVelocity(vertex){ //KRISTINA
        //Update velocity if ball hits wall
        const x = vertex.values[0]
        const y = vertex.values[1]
        //If ball hits left or right wall
        if(x <= 0 || x >= this.canvas.width){
            this.ball_velocity.x = - this.ball_velocity.x
        }
        //If ball hits top or bottom wall
        if(y <= 0 || y >= this.canvas.height){
            this.ball_velocity.y = - this.ball_velocity.y
        }
        return false;
    }

    //
    drawSlide1() { //KRISTINA
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction
        let shapes = this.models.slide1

        //For each shape
        for(let polygon of shapes){
            let new_vertices = []
            //Transform vertices for each shape
            for(let v=0;v<polygon.vertices.length;v++){

                let new_vector = Matrix.multiply([polygon.transform, polygon.vertices[v]])
                new_vertices.push(new_vector)
            }

            //Draw 3+ polygons
            let teal = [0, 128, 128, 255];
            this.drawConvexPolygon(new_vertices, polygon.color);

        }
        
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions

        let teal = [0, 128, 128, 255];
        this.drawConvexPolygon(this.models.slide2[0].vertices, teal);
        let orange = [255, 128, 0, 255];
        this.drawConvexPolygon(this.models.slide2[0].vertices2, orange);
    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }
};

export { Renderer };
