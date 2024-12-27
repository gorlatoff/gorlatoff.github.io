function flatted0(scale)
    return [flatted_value(i) for i in scale]
end

function flatted_value0(i)
    while i < 1
        i *= 2
    end
    while i > 2
        i /= 2
    end
    return i
end

flatted_value(i) = i / (2//1)^floor(Int, log2(i))
flatted(scale) = [flatted_value(i) for i in scale]


result = [(3//2)^i for i in -5:5]
flatted(result)


function approximate_rational(val, max_value)
    closest_fraction = 1//1
    min_difference = abs(val - closest_fraction)
    
    for numerator in 1:max_value
        for denominator in 1:max_value
            fraction = numerator // denominator
            difference = abs(val - fraction)
            if difference < min_difference
                closest_fraction = fraction
                min_difference = difference
            end
        end
    end
    
    return closest_fraction
end

approximated_result = [approximate_rational(r, 16) for r in result]