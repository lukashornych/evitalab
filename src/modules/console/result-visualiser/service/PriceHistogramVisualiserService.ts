/**
 * Service for visualising raw JSON price histograms.
 */
export interface PriceHistogramVisualiserService {

    /**
     * Resolves visualisable price histogram from the price histogram result.
     */
    resolvePriceHistogram(priceHistogramResult: Result): VisualisedHistogram
}
