export class Entity{
	
	constructor(asset, color, position = [0,0], scale = 1.0){
		this.asset = asset; 
		this.color = color; 
		this.position = position; 
		this.scale = scale; 
	}
	
		draw(gl, locations){
			//this binds the buffer and sets up the 'aPostion' attribute
			this.asset.enable(locations.aPosition); 
			
			gl.uniform2fv(locations.uTranslation, this.position); 
			
			gl.uniform1f(locations.uScale, this.scale); 
			
			gl.uniform4fv(locations.uColor, this.color); 
		
		
			const mode = this.asset.vertexCount >3 ? gl.TRIANGLE_FAN : gl.TRIANGLES; 
			gl.drawArrays(mode, 0, this.asset.vertexCount); 
		
		}
	
}

