import { Factory, Truck, DollarSign, Map, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-xl text-gray-600">
            Simple, efficient, and transparent transport bidding
          </p>
        </div>

        <div className="mt-16">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden sm:block absolute top-0 left-1/2 w-0.5 h-full bg-gray-200 transform -translate-x-1/2"></div>

            {/* Steps for Factory Owners */}
            <div className="relative mb-12 sm:mb-24">
              <div className="sm:flex items-center">
                {/* Icon on the timeline */}
                <div className="hidden sm:flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 border-4 border-white">
                    <Factory className="h-6 w-6" />
                  </div>
                  <div className="text-blue-600 font-medium mt-2">Step 1</div>
                </div>

                {/* Step content */}
                <div className="mt-6 sm:mt-0 sm:ml-10 lg:ml-16 sm:w-1/2">
                  <div className="relative rounded-lg bg-white p-6 shadow-md">
                    <div className="sm:hidden flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                      <Factory className="h-5 w-5" />
                    </div>
                    <div className="sm:hidden text-blue-600 font-medium mb-2">Step 1</div>
                    <h3 className="text-lg font-bold text-gray-900">Create a Route Request</h3>
                    <p className="mt-2 text-gray-600">
                      Factory owners post their shipping requirements including origin, destination, 
                      load type, and special requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps for Transport Owners */}
            <div className="relative mb-12 sm:mb-24">
              <div className="sm:flex items-center justify-end">
                {/* Step content */}
                <div className="mt-6 sm:mt-0 sm:mr-10 lg:mr-16 sm:w-1/2">
                  <div className="relative rounded-lg bg-white p-6 shadow-md">
                    <div className="sm:hidden flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div className="sm:hidden text-green-600 font-medium mb-2">Step 2</div>
                    <h3 className="text-lg font-bold text-gray-900">Transport Owners Place Bids</h3>
                    <p className="mt-2 text-gray-600">
                      Transport owners review available routes and submit competitive bids based on their 
                      vehicle availability and pricing.
                    </p>
                  </div>
                </div>

                {/* Icon on the timeline */}
                <div className="hidden sm:flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 border-4 border-white">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div className="text-green-600 font-medium mt-2">Step 2</div>
                </div>
              </div>
            </div>

            {/* Steps for Bidding Process */}
            <div className="relative mb-12 sm:mb-24">
              <div className="sm:flex items-center">
                {/* Icon on the timeline */}
                <div className="hidden sm:flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 border-4 border-white">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div className="text-yellow-600 font-medium mt-2">Step 3</div>
                </div>

                {/* Step content */}
                <div className="mt-6 sm:mt-0 sm:ml-10 lg:ml-16 sm:w-1/2">
                  <div className="relative rounded-lg bg-white p-6 shadow-md">
                    <div className="sm:hidden flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-4">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div className="sm:hidden text-yellow-600 font-medium mb-2">Step 3</div>
                    <h3 className="text-lg font-bold text-gray-900">Transparent Bidding</h3>
                    <p className="mt-2 text-gray-600">
                      Factory owners review and compare bids from multiple transport providers, 
                      considering price, ratings, and vehicle suitability.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps for Selection */}
            <div className="relative mb-12 sm:mb-24">
              <div className="sm:flex items-center justify-end">
                {/* Step content */}
                <div className="mt-6 sm:mt-0 sm:mr-10 lg:mr-16 sm:w-1/2">
                  <div className="relative rounded-lg bg-white p-6 shadow-md">
                    <div className="sm:hidden flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="sm:hidden text-purple-600 font-medium mb-2">Step 4</div>
                    <h3 className="text-lg font-bold text-gray-900">Select and Confirm</h3>
                    <p className="mt-2 text-gray-600">
                      Factory owners select the most suitable transport provider and confirm the booking with 
                      just a few clicks.
                    </p>
                  </div>
                </div>

                {/* Icon on the timeline */}
                <div className="hidden sm:flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 border-4 border-white">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="text-purple-600 font-medium mt-2">Step 4</div>
                </div>
              </div>
            </div>

            {/* Steps for Tracking */}
            <div className="relative">
              <div className="sm:flex items-center">
                {/* Icon on the timeline */}
                <div className="hidden sm:flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 border-4 border-white">
                    <Map className="h-6 w-6" />
                  </div>
                  <div className="text-indigo-600 font-medium mt-2">Step 5</div>
                </div>

                {/* Step content */}
                <div className="mt-6 sm:mt-0 sm:ml-10 lg:ml-16 sm:w-1/2">
                  <div className="relative rounded-lg bg-white p-6 shadow-md">
                    <div className="sm:hidden flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
                      <Map className="h-5 w-5" />
                    </div>
                    <div className="sm:hidden text-indigo-600 font-medium mb-2">Step 5</div>
                    <h3 className="text-lg font-bold text-gray-900">Real-time Tracking</h3>
                    <p className="mt-2 text-gray-600">
                      Both parties can track the shipment in real-time, from pickup to delivery, ensuring 
                      transparency and peace of mind.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 