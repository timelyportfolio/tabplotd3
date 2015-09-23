#' Interactive tableplot
#' 
#' \code{itabplot} is an interactive version of \code{\link{tableplot}}. It starts 
#' your browser and allows for zooming, panning and sorting the tableplot. This
#' version can be used for explorative usage, while \code{tableplot} can be used for
#' publication purposes.
#' It needs the same parameters as tabplot.
#' @param x \code{data.frame} or \code{ffdf} object used for plotting.
#' @param ... parameters that will be given to \code{tableplot}
#' @seealso \code{\link{tableplot}}
#' @export
#' @importFrom tabplot tableplot
itabplot <- function(x, ..., height = NULL, width = NULL){
  xlit <- deparse(substitute(x))
  tp <- tableplot(x, plot=FALSE, ...)
  
  # create widget
  htmlwidgets::createWidget(
    name = 'itabplot',
    x = tp,
    width = width,
    height = height,
    package = 'tabplotd3'
  )
}
