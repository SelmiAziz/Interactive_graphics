// Engine.js
import { Driver } from './Driver.js';
import { Asset } from './Asset.js';
import { Entity } from './Entity.js';
import { VertexShaderSource, FragmentShaderSource } from './Shaders.js';

/**
 * The Engine class orchestrates the entire WebGL application.
 * It manages the lifecycle of assets, entities, and the rendering loop.
 */
export class Engine {
    constructor(canvasId) {
        // 1. Initialize the low-level hardware driver
        this.driver = new Driver(canvasId);
        
        
        this.driver.loadShaders(VertexShaderSource, FragmentShaderSource);

        // 3. Store the "Phonebook" of memory addresses (Locations)
        // We query the GPU once to find where our variables are stored
        this.locations = {
            aPosition: this.driver.getLocation('aPosition', false),
            uTranslation: this.driver.getLocation('uTranslation', true),
            uScale: this.driver.getLocation('uScale', true),
            uColor: this.driver.getLocation('uColor', true)
        };

        // 4. Create the Geometry Templates (Assets)
        this.assets = {
            triangle: Asset.CreateTriangle(this.driver.gl),
            circle: Asset.CreateCircle(this.driver.gl, 64)
        };

        // 5. Initialize the specific objects (Entities)
        this.entities = this._initEntities();
    }

    /**
     * Create the instances for our two different screen areas.
     */
    _initEntities() {
        return {
            // LEFT AREA: Three distinct triangles
            area1: [
                new Entity(this.assets.triangle, [1.0, 0.0, 0.0, 1.0], [-0.5, 0.5], 1.2), // Red
                new Entity(this.assets.triangle, [0.0, 1.0, 0.0, 1.0], [0.4, -0.3], 0.8), // Green
                new Entity(this.assets.triangle, [0.0, 0.0, 1.0, 1.0], [-0.7, -0.6], 1.0) // Blue
            ],
            // RIGHT AREA: A circle with a triangle inside
            area2: [
                new Entity(this.assets.circle, [0.2, 0.2, 0.2, 1.0], [0.0, 0.0], 0.7),   // Dark Circle
                new Entity(this.assets.triangle, [1.0, 1.0, 0.0, 1.0], [0.0, 0.0], 0.3) // Yellow Triangle
            ]
        };
    }

    /**
     * The main rendering loop.
     */
    run() {
        const gl = this.driver.gl;
        const width = this.driver.canvas.width;
        const height = this.driver.canvas.height;

        // --- DRAW AREA 1 (LEFT) ---
        // Math: Viewport takes half the width: [0 to width/2]
        this.driver.isolateArea(0, 0, width / 2, height, 0.5, 0.8, 1.0); 
        // Light Blue background
        this.entities.area1.forEach(entity => entity.draw(gl, this.locations));

        // --- DRAW AREA 2 (RIGHT) ---
        // Math: Viewport starts at half width: [width/2 to width]
        this.driver.isolateArea(width / 2, 0, width / 2, height, 1.0, 1.0, 1.0); 
        // White background
        this.entities.area2.forEach(entity => entity.draw(gl, this.locations));

        // Request the next frame (Animation loop)
        requestAnimationFrame(() => this.run());
    }
}
