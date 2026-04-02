export const VertexShaderSource = `
	
	attribute vec4 aPosition; 
	uniform vec2 uTranslation; 
	uniform float uScale; 
	
	void main(){
		vec2 finalPos = (aPosition.xy*uScale) + uTranslation; 
		
		gl_Position = vec4(finalPos, 0.0, 1.0);
	
	}
`;

//what does it mean attribute uniform precision and all this stuff

export const FragmentShaderSource = `
	precision mediump float; 
	uniform vec4 uColor; 
	
	void main(){
		gl_FragColor = uColor; 
	
	}
`;
