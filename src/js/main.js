window.onload = function(){
   CanvasAnim.resize();
   CanvasAnim.drawCanvas();

    var projects = document.querySelectorAll(".project");
    for(var i = 0; i < projects.length; i++){
        projects[i].addEventListener('click', ProjectLightbox.showProject.bind(ProjectLightbox));
    };

    var closeButtons = document.querySelectorAll('.close');
    for(var i = 0; i < closeButtons.length; i++){
        closeButtons[i].addEventListener('click', ProjectLightbox.toggleLightBox);
    };

    document.getElementById('light-box').addEventListener('click', function(e){
        e.stopPropagation();
        if(e.target.id === "light-box"){
            ProjectLightbox.toggleLightBox();
        }
    });

    window.addEventListener('resize', function(){
        CanvasAnim.resize();
        CanvasAnim.drawCanvas();
    });
}; 


var ProjectLightbox = function(){
    var lb = document.getElementById('light-box');
    var projects  = document.querySelectorAll('.project-show');

    return {

        toggleLightBox: function(){
            document.body.style.overflow === "hidden" ? document.body.style.overflow = "initial" : document.body.style.overflow = "hidden";
            lb.style.display === 'flex' ? lb.style.display = "none" : lb.style.display = "flex";
        },

        hideOthers: function(id){
            var name = "project-"+id;
            for(var i = 0; i < projects.length; i++){
                if(projects[i].id !== name){
                    projects[i].style.display = "none";
                }
            }
        },

        showProject: function(e){
            if(e.currentTarget.classList.contains('project')){
                var target = e.currentTarget.dataset.project;
                var el = document.getElementById("project-"+target);
                el.style.display = "block";
                this.hideOthers(target);
                this.toggleLightBox();
            }
        }
    }
}();

var Particle = function(maxX, maxY){
    var velocities = [0.75 , -0.75];
    this.maxX = maxX - 10;
    this.maxY = maxY - 10;
    this.x = Math.floor(Math.random() * maxX);
    this.y = Math.floor(Math.random() * maxY );
    this.vx = velocities[Math.floor(Math.random() * velocities.length)];
    this.vy = velocities[Math.floor(Math.random() * velocities.length)];
}

Particle.prototype.updatePosition = function(){
    var newX = this.x + this.vx;
    var newY = this.y + this.vy;
    
    if(newX <= 10 || newX >= this.maxX){
        this.vx = this.vx * -1;
        this.x += this.vx;
    }else{
        this.x = newX;
    }

    if(newY <= 10 || newY >= this.maxY){
        this.vy = this.vy * -1;
        this.y += this.vy;
    }else{
        this.y = newY;
    }
}

Particle.prototype.isNearby = function(other){
    var left = this.x - 100;
    var right = this.x + 100;
    var bottom = this.y - 100;
    var top = this.y + 100;

    return (other.x > left && other.x < right) && (other.y > bottom && other.y < top);
}

var CanvasAnim = function(){
    var maxWidth;
    var maxHeight;
    var totalParticles = 50;
    var particles = [];
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var animationId;

    return {

        resize: function(){
            this.setWidth();
            this.setHeight();
            window.innerWidth > 600 ? totalParticles = 100 : totalParticles = 20;
            particles = [];
            animationId && cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, maxWidth, maxHeight);
        },

        setWidth: function(){
             var width = canvas.parentNode.offsetWidth
             canvas.width = width;
             maxWidth = width;
        },

        setHeight: function(){
            var height = canvas.parentNode.offsetHeight
            canvas.height = height;
            maxHeight = height;
        },

        drawCanvas: function(){
             for(var i = 0; i < totalParticles; i++){
                var particle = new Particle(maxWidth, maxHeight);
                particle.id = i;
                particles.push(particle);
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            this.animate();
        },

        drawNearby: function(current){
            for(var i = 0; i < particles.length; i++){
                var next =  particles[i];
                if(next.id !== current.id && current.isNearby(next)){
                    ctx.beginPath();
                    ctx.strokeStyle = "#e74c3c";
                    ctx.moveTo(current.x, current.y);
                    ctx.lineTo(next.x , next.y);
                    ctx.stroke();
                }
            }
        },

        animate: function(){
            //var t0 = performance.now();
            animationId =  window.requestAnimationFrame(this.animate.bind(this));
            ctx.clearRect(0, 0, maxWidth, maxHeight);
            for(var i = 0; i < particles.length; i++){
                var particle = particles[i];
                particle.updatePosition();
                this.drawNearby(particle);
                ctx.beginPath();
                ctx.fillStyle = "#E7E9E7";
                ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            //var t1 = performance.now();
            //console.log(t1 - t0);
        }    
    }

}();