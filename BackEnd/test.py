import torch

# Check for CUDA availability
if torch.cuda.is_available():
    # Create a tensor on the GPU
    x = torch.rand(3, 3).to("cuda")
    print("GPU is working with PyTorch:", x)
else:
    print("CUDA is not available.")
