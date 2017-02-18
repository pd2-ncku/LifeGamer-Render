var coordinate = function( original_w , original_h , w_grid , h_grid){
    this.width = original_w;
    this.height = original_h;
    this.w_grid = w_grid;
    this.h_grid = h_grid;
    // Calculate the tranform
    this.w_unit_size = this.width / this.w_grid;
    this.h_unit_size = this.height / this.h_grid;
}

coordinate.prototype.get_x_loc = function( grid_x ){
    return grid_x * w_unit_size;
}

coordinate.prototype.get_y_loc = function( grid_y ){
    return grid_y * h_unit_size;
}
